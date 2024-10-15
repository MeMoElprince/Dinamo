import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUser } from './dto';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { RolesGuard } from 'src/auth/guard/role.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin, Role.Client)
    @ApiBearerAuth('default')
    @ApiOperation({
        summary: 'Create a user',
        description: 'Create a new user',
    })
    async create(@Body() createUserDto: CreateUser) {
        return await this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    @ApiBearerAuth('default')
    @ApiOperation({ summary: 'Get my profile', description: 'Get my profile' })
    async me(@GetUser() user: User) {
        return user;
    }

    @Patch('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth('default')
    @ApiOperation({
        summary: 'Update my profile',
        description: 'Update my profile',
    })
    async updateMe(
        @GetUser('_id') userId: string,
        @Body() updateUserDto: CreateUser,
    ) {
        return await this.userService.update(userId, updateUserDto);
    }
}
