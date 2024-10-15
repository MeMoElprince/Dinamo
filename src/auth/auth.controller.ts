import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Signup } from './dto/signup.dto';
import { Login } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator';
import { User } from 'src/user/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ summary: 'User Register', description: 'Signing up user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    signup(@Body() body: Signup) {
        return this.authService.signup(body);
    }

    @ApiOperation({ summary: 'User Login', description: 'Logging in user' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() body: Login) {
        return this.authService.login(body);
    }

    @ApiOperation({
        summary: 'Google auth',
        description:
            'This end point used to redirect user to google for loging or registering',
    })
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    @ApiOperation({
        summary: 'Google auth redirect',
        description: "You don't use this endpoint, it's for google",
    })
    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@GetUser() user: User) {
        console.log({ user });
        return user;
    }
}
