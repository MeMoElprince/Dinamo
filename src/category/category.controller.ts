import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Role } from 'src/auth/enum/role.enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @ApiOperation({
        summary: 'Create a new category',
        description: 'This endpoint is used to create a new category',
    })
    @ApiBearerAuth('default')
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @ApiOperation({
        summary: 'Get all categories',
        description: 'This endpoint is used to get all categories',
    })
    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @ApiOperation({
        summary: 'Get a category by id',
        description: 'This endpoint is used to get a category by id',
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @ApiParam({ name: 'id', description: 'Category id', required: true })
    @ApiOperation({
        summary: 'Update a category by id',
        description: 'This endpoint is used to update a category by id',
    })
    @ApiBearerAuth('default')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @ApiParam({ name: 'id', description: 'Category id', required: true })
    @ApiOperation({
        summary: 'Delete a category by id',
        description: 'This endpoint is used to delete a category by id',
    })
    @ApiBearerAuth('default')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
