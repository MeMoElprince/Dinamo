import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as _ from 'underscore';
import { CheckoutKashierDto } from './dto/checkout-kashier.dto';
import { KahierWebhookDto } from './dto/kahier-webhook.dto';
import { color } from 'src/utils/color';

@Injectable()
export class KashierService {
    constructor(private config: ConfigService) {}

    private readonly mid: string = this.config.get('KASHIER_MID');
    private readonly mode: string = this.config.get('KAHIER_MODE');
    private readonly apiKey: string = this.config.get('KASHIER_API_KEY');
    private readonly secret: string = this.config.get('KASHIER_SECRET_API_KEY');

    private generateKashierOrderHash(
        amount: number,
        currency: string,
        orderId: number,
    ) {
        if (!this.mid || !amount || !currency || !orderId || !this.apiKey) {
            throw new Error('Missing required parameters');
        }
        console.log(this.mid, amount, currency, orderId, this.apiKey);
        const path = `/?payment=${this.mid}.${orderId}.${amount}.${currency}`;
        const hash = crypto
            .createHmac('sha256', this.apiKey)
            .update(path)
            .digest('hex');
        return hash;
    }

    // Helper function to stringify an object into a URL-encoded string
    private stringify(obj: Record<string, any>): string {
        return Object.keys(obj)
            .map(
                (key) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`,
            )
            .join('&');
    }

    private validateSignature(
        kashierWebhookDto: KahierWebhookDto,
        kashierSignature: string,
    ) {
        const { data, event } = kashierWebhookDto;
        data.signatureKeys.sort();
        // Pick only the keys that are listed in data.signatureKeys
        const objectSignaturePayload = _.pick(data, data.signatureKeys);
        // Stringify the object to create the signature payload
        const signaturePayload = this.stringify(objectSignaturePayload);
        // Create a HMAC SHA-256 hash with the secret and the payload
        const signature = crypto
            .createHmac('sha256', this.apiKey)
            .update(signaturePayload)
            .digest('hex');
        if (kashierSignature === signature) {
            console.log('Valid signature');
            return true;
        }
        return false;
    }

    async checkout(
        callback: string,
        metaData: object | string,
        checkoutDto: CheckoutKashierDto,
    ) {
        const baseUrl = 'https://checkout.kashier.io';
        const merchantOrderId = Date.now();
        const currency = checkoutDto.currency || 'EGP';
        const brandColor = checkoutDto.brandColor || 'rgba(163, 0, 0, 1)';
        metaData = JSON.stringify(metaData);
        const display = checkoutDto.display || 'en';
        const failureRedirect = checkoutDto.failureRedirect || 'true';
        const redirectMethod = checkoutDto.redirectMethod || 'get';
        const websiteRedirect =
            checkoutDto.websiteRedirect || 'https://google.com';

        // callbackurl that will be called after payment is done
        // IMP IMP IMP this for production
        const host = this.config.get('WEBSITE_URL');
        let callbackUrl = host + `${callback}`;
        console.log({ prodUrlCallback: callbackUrl });

        // IMP-----------------------------------------------------------------------------
        if (this.config.get('NODE_ENV') === 'development')
            callbackUrl = `https://3006-41-236-88-239.ngrok-free.app${callback}`;

        console.log({ callbackUrl });
        const order: any = {
            amount: checkoutDto.amount,
            // (ISO: "EGP", "USD", "GBP" "EUR")
            currency,
            // Unique order using as reference between merchant and kashier
            merchantOrderId,
            // Kashier Merchant ID 'MID-XXX-XX'
            mid: this.mid,
            // Kashier API Key
            secret: this.secret,
            baseUrl,
            //order meta data JSON String
            metaData,
            //Add merchantRedirect, to redirect to it after making payment.
            merchantRedirect: websiteRedirect,
            //Add display, to choose what the display language do you want ar for arabic and en for english.
            display,
            //Add failureRedirect, to choose to redirect after first payment failiure or not.
            //, failureRedirect: 'false || true'
            failureRedirect,
            redirectMethod,
            brandColor,
            // Test or live
            mode: this.mode,
            // The main webhook
            serverWebhook: callbackUrl,
        };
        const hash = this.generateKashierOrderHash(
            checkoutDto.amount,
            currency,
            order.merchantOrderId,
        );
        order.hash = hash;
        const hppUrl =
            `${order.baseUrl}?` +
            `merchantId=${order.mid}` +
            `&orderId=${order.merchantOrderId}` +
            `&amount=${order.amount}` +
            `&currency=${order.currency}` +
            `&hash=${order.hash}` +
            `&merchantRedirect=${order.merchantRedirect}` +
            `&metaData=${order.metaData ? encodeURIComponent(order.metaData) : ''}` +
            `&failureRedirect=${order.failureRedirect ? order.failureRedirect : ''}` +
            `&redirectMethod=${order.redirectMethod ? order.redirectMethod : ''}` +
            `&display=${order.display ? order.display : ''}` +
            `&brandColor=${encodeURIComponent(order.brandColor)}` +
            `&mode=${order.mode}` +
            `&serverWebhook=${order.serverWebhook}`;
        return { hppUrl, order };
    }

    async webhook(
        kashierWebhookDto: KahierWebhookDto,
        kashierSignature: string,
    ) {
        console.log(color.FgMagenta, 'KASIER WEBHOOK', color.Reset);
        if (!this.validateSignature(kashierWebhookDto, kashierSignature))
            throw new ForbiddenException('Invalid Signature');
        const { data, event } = kashierWebhookDto;
        if (event === 'pay') {
            console.log(color.FgBlue, 'PAYMENT EVENT', color.Reset);
            if (data.status === 'SUCCESS') {
                console.log(color.BgBlue, 'PAYMENT SUCCESS', color.Reset);
            } else console.log(color.FgBlue, 'PAYMENT FAILED', color.Reset);
        } else if (event === 'refund') {
            console.log(color.FgBlue, 'REFUND EVENT', color.Reset);
        }
        console.log(color.FgGreen, 'Success Mission', color.Reset);
        return 'webhook recived';
    }
}
