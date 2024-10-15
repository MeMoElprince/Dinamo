import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUser, UpdateUser } from './dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    create(data: CreateUser): Promise<User> {
        const createdUser = new this.userModel(data);
        return createdUser.save();
    }

    async update(id: string, data: UpdateUser): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, data, { new: true });
    }

    getMessageTest(): string {
        return 'Hello from user service test';
    }
}
