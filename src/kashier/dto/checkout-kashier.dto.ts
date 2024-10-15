import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CheckoutKashierDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 100.5, description: 'The amount for the payment' })
    amount: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, example: 'EGP' })
    currency?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, example: '#FF5733' })
    brandColor?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, example: 'en' })
    display?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, example: 'true' })
    failureRedirect?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, example: 'get' })
    redirectMethod?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, example: 'https://google.com' })
    websiteRedirect?: string;
}
