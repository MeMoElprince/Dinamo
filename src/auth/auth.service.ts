import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Signup, Login } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    async signup(body: Signup): Promise<{ user: User; access_token: string }> {
        const createdUser = new this.userModel(body);
        await createdUser.save();
        const access_token = await this.signToken(
            createdUser._id,
            createdUser.email,
        );
        delete createdUser.password;
        return { user: createdUser, access_token };
    }

    async login(body: Login): Promise<{ user: User; access_token: string }> {
        const user = await this.userModel.findOne({ email: body.email });
        if (
            !user ||
            !(await this.comparePassword(body.password, user.password))
        ) {
            throw new Error('Invalid email or password');
        }
        const access_token = await this.signToken(user._id, user.email);
        delete user.password;
        return { user, access_token };
    }

    googleLogin(req: Request) {
        if (!req['user']) {
            return 'no user from google';
        }
        return {
            message: 'User information from google',
            user: req['user'],
        };
    }

    comparePassword(password: string, userPassword: string): Promise<boolean> {
        return argon2.verify(userPassword, password);
    }

    signToken(userId: Types.ObjectId, email: string): Promise<string> {
        return this.jwtService.signAsync(
            {
                sub: userId,
                email,
            },
            {
                expiresIn: '20d',
                secret: this.config.get('JWT_SECRET'),
            },
        );
    }
}
