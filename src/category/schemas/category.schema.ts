import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
    @Prop({
        required: [true, 'Name is required'],
        unique: [true, 'Name should be unique'],
    })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: Date.now() })
    createdAt: Date;

    @Prop({ default: Date.now() })
    updatedAt: Date;

    @Prop({ default: null, type: 'ObjectId', ref: 'Category' })
    parentCategory: CategoryDocument;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
