import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as argon2 from 'argon2';
import { Role } from 'src/auth/enum/role.enum';
import { Status } from '../enum/status.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: [true, 'Name is required'] })
    name: string;

    @Prop({ required: [true, 'Email is required'], unique: true })
    email: string;

    @Prop({ required: [true, 'Password is required'] })
    password: string;

    @Prop({ unique: true, sparse: true })
    phone: string;

    @Prop({
        required: [true, 'role is required'],
        enum: Role,
        default: Role.Client,
    })
    role: string;

    @Prop({
        required: [true, 'status is required'],
        enum: Status,
        default: Status.Active,
    })
    status: string;

    @Prop()
    country: string;

    @Prop()
    address: string;

    @Prop()
    job: string;

    @Prop({ default: 'default.png' })
    coverImage: string;

    @Prop({ default: Date.now() })
    createdAt: Date;

    @Prop({ default: Date.now() })
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
    if (this.isModified('password'))
        this.password = await argon2.hash(this.password);
    next();
});
