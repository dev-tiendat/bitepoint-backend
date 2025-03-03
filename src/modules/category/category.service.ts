import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Like, Repository } from 'typeorm';
import { isEmpty, isNil } from 'lodash';

import { paginate } from '~/helper/paginate';
import { Pagination } from '~/helper/paginate/pagination';
import { Order } from '~/common/dto/pager.dto';

import { FileService } from '../file/file.service';
import {
    CategoryDto,
    CategoryQueryDto,
    CategoryUpdateDto,
} from './category.dto';
import { CategoryEntity } from './category.entity';
import { CategoryDetail, OrderCategory } from './category.model';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepository: Repository<CategoryEntity>,
        private fileService: FileService,
        @InjectMapper()
        private mapper: Mapper
    ) {}

    async list({
        page,
        limit: pageSize,
        field,
        query,
        order = Order.ASC,
    }: CategoryQueryDto): Promise<Pagination<CategoryDetail>> {
        const queryBuilder =
            this.categoryRepository.createQueryBuilder('category');

        queryBuilder.where({
            ...(query ? { name: Like(`%${query}%`) } : null),
            ...(query ? { description: Like(`%${query}%`) } : null),
        });

        if (!isEmpty(field)) {
            queryBuilder.orderBy(`category.${field}`, order);
        }

        return paginate<CategoryEntity, CategoryDetail>(
            queryBuilder,
            { page, pageSize },
            source =>
                this.mapper.mapArray(source, CategoryEntity, CategoryDetail)
        );
    }

    async infoList(): Promise<OrderCategory[]> {
        const list = await this.categoryRepository.find({
            relations: ['menuItems', 'menuItems.historyPrices'],
            order: {
                menuItems: {
                    popular: 'DESC',
                },
            },
        });

        return this.mapper.mapArray(list, CategoryEntity, OrderCategory);
    }

    async info(id: number): Promise<CategoryDetail> {
        const category = await this.findOneById(id);
        return this.mapper.map(category, CategoryEntity, CategoryDetail);
    }

    async create(dto: CategoryDto): Promise<CategoryDetail> {
        const { image, ...data } = dto;
        const imagePath = await this.fileService.saveFile(dto.image);
        const result = await this.categoryRepository.save({
            ...data,
            image: imagePath,
        });

        return this.mapper.map(result, CategoryEntity, CategoryDetail);
    }

    async update(id: number, dto: CategoryUpdateDto): Promise<CategoryDetail> {
        const category = await this.findOneById(id);

        const { image, ...data } = dto;

        let imagePath = null;
        if (!isNil(dto.image)) {
            imagePath = await this.fileService.saveFile(image);
        }

        const updatedCategory = await this.categoryRepository.save({
            ...category,
            ...data,
            image: imagePath ? imagePath : category.image,
        });

        return this.mapper.map(updatedCategory, CategoryEntity, CategoryDetail);
    }

    async delete(id: number): Promise<void> {
        await this.categoryRepository.delete(id);
    }

    async findOneById(id: number): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOneBy({ id });
        if (isNil(category)) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }
}
