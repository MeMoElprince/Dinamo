import { Controller, Post, Body, Headers } from '@nestjs/common';
import { KashierService } from './kashier.service';
import { ApiTags } from '@nestjs/swagger';
import { KahierWebhookDto } from './dto/kahier-webhook.dto';

@Controller('kashier')
@ApiTags('Kashier Webhook')
export class KashierController {
    constructor(private readonly kashierService: KashierService) {}

    @Post('webhook')
    async projectStagePaymentWebhook(
        @Body() kashierWebhookDto: KahierWebhookDto,
        @Headers('x-kashier-signature') kashierSignature: string,
    ) {
        return 'hello, world!';
    }
}
