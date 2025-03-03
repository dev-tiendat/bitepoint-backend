import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '../file/file.module';

import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './category.entity';
import { CategoryProfile } from './category.profile';

const providers = [CategoryService, CategoryProfile];

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity]), FileModule],
    providers: [...providers],
    controllers: [CategoryController],
    exports: [TypeOrmModule, ...providers],
})
export class CategoryModule {}
