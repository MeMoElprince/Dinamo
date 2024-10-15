import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';

export class Signup {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Mustafa Elsharawy',
        description: 'The name of the user',
    })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: 'memo@gmail.com',
        description: 'The email of the user',
    })
    email: string;

    @IsString()
    @ApiProperty({ example: 'memo', description: 'The password of the user' })
    @IsNotEmpty()
    password: string;

    // @IsString()
    // @IsNotEmpty()
    // @ValidateIf(o => o.password !== undefined)
    // @Matches('password')
    // passwordConfirm: string;

    @IsPhoneNumber()
    @ApiProperty({
        required: false,
        example: '+201234567890',
        description: 'The phone number of the user',
    })
    @IsOptional()
    phone: string;

    @IsString()
    @ApiProperty({
        required: false,
        example: 'Egypt',
        description: 'The country of the user',
    })
    @IsOptional()
    country: string;

    @IsString()
    @ApiProperty({
        required: false,
        example: 'Cairo',
        description: 'The city of the user',
    })
    @IsOptional()
    address: string;

    @IsOptional()
    @ApiProperty({
        required: false,
        example: 'Developer',
        description: 'The job of the user',
    })
    @IsString()
    job: string;

    @IsOptional()
    @ApiProperty({
        required: false,
        example: 'example.png',
        description: 'The cover image of the user',
    })
    @IsString()
    coverImage: string;
}
