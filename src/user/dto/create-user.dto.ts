import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
} from 'class-validator';
import { Role } from 'src/auth/enum/role.enum';
import { Status } from '../enum/status.enum';

export class CreateUser {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'Mustafa Elsharawy' })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ default: 'memo@gmail.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: 'memo' })
    password: string;

    @IsPhoneNumber()
    @IsOptional()
    @ApiProperty({ required: false, default: '+201234567890' })
    phone: string;

    @IsEnum(Role)
    @IsNotEmpty()
    @ApiProperty({ enum: Role, default: Role.Client })
    role: string;

    @IsEnum(Status)
    @IsOptional()
    @ApiProperty({ required: false, enum: Status, default: Status.Active })
    status: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    country: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    address: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    job: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    coverImage: string;
}
