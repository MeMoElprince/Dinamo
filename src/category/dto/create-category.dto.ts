import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Category Name',
        description: 'The name of the category',
        required: true,
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Category Description',
        description: 'The description of the category',
        required: false,
    })
    description: string;
}
