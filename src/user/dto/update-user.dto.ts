import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '../enum/status.enum';

export class UpdateUser {
    @ApiProperty({
        required: false,
        example: 'Mustafa Elsharawy',
        description: 'The new name',
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        required: false,
        example: 'memo@gmail.com',
        description: 'The new email',
    })
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty({
        required: false,
        example: Status.Active,
        description: 'The new status',
        enum: Status,
    })
    @IsOptional()
    @IsEnum(Status)
    status: string;

    @ApiProperty({
        required: false,
        example: '+201234567891',
        description: 'The new phone number',
    })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({
        required: false,
        example: 'Egypt',
        description: 'The new address',
    })
    @IsOptional()
    @IsString()
    address: string;

    @ApiProperty({
        required: false,
        example: 'Software Engineer',
        description: 'The new job',
    })
    @IsOptional()
    @IsString()
    job: string;

    @ApiProperty({
        required: false,
        example: 'Egypt',
        description: 'The new country',
    })
    @IsOptional()
    @IsString()
    country: string;

    @ApiProperty({
        required: false,
        example: 'default.png',
        description: 'The new cover image',
    })
    @IsOptional()
    @IsString()
    coverImage: string;
}
