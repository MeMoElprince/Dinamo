import { OmitType, PartialType } from '@nestjs/swagger';
import { CheckoutKashierDto } from './checkout-kashier.dto';

export class CheckoutPropertiesDto extends PartialType(
    OmitType(CheckoutKashierDto, ['amount']),
) {}
