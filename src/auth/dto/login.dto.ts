import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Login {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ default: 'memo@gmail.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'memo' })
    password: string;
}
