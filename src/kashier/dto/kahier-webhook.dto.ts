import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class KahierWebhookDto {
    @IsObject()
    @IsNotEmpty()
    data: any;

    @IsString()
    @IsNotEmpty()
    event: string;
}
