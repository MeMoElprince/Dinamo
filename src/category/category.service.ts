import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        return await this.categoryModel.create(createCategoryDto);
    }

    findAll() {
        return this.categoryModel.find().exec();
    }

    async findOne(id: string) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryModel
            .findByIdAndUpdate(id, updateCategoryDto, { new: true })
            .exec();
        if (!category) {
            throw new NotFoundException(`Category not found`);
        }
        return category;
    }

    remove(id: string) {
        return this.categoryModel.findByIdAndDelete(id).exec();
    }
}
