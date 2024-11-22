import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNil } from 'lodash';

import { CategoryEntity } from './category.entity';
import { CategoryDto, CategoryUpdateDto } from './category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>
    ) {}

    async list(): Promise<CategoryEntity[]> {
        return this.categoryRepository.find();
    }

    async create(dto: CategoryDto): Promise<void> {
        await this.categoryRepository.save(dto);
    }

    async update(id: number, dto: CategoryUpdateDto): Promise<void> {
        await this.categoryRepository.update(id, dto);
    }

    async delete(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
    }

    async findCategoryById(id: number): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!isNil(category)) {
            throw new Error('Category does not found');
        }

        return category;
    }
}
