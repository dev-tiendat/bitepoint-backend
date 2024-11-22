import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './category.entity';

const providers = [CategoryService];

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity])],
    providers: [...providers],
    controllers: [CategoryController],
    exports: [TypeOrmModule, ...providers],
})
export class CategoryModule {}
