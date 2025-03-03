import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { isNil } from 'lodash';

import { paginate } from '~/helper/paginate';
import { Pagination } from '~/helper/paginate/pagination';

import { FileService } from '../file/file.service';
import { CategoryService } from '../category/category.service';
import { MenuItemEntity } from './entities/menu-item.entity';
import { MenuItemPriceEntity } from './entities/menu-item-price.entity';
import {
    MenuItemDto,
    MenuItemQueryDto,
    MenuItemUpdateDto,
} from './menu-item.dto';
import { MenuItemStatus } from './menu-item.constant';
import { MenuItemDetail, MenuItemInfo } from './menu-item.model';


@Injectable()
export class MenuItemService {
    constructor(
        @InjectEntityManager()
        private entityManager: EntityManager,
        @InjectRepository(MenuItemEntity)
        private menuItemRepository: Repository<MenuItemEntity>,
        @InjectRepository(MenuItemPriceEntity)
        private menuItemPriceRepository: Repository<MenuItemPriceEntity>,
        private fileService: FileService,
        private categoryService: CategoryService,
        @InjectMapper()
        private mapper: Mapper
    ) {}

    async list({
        page,
        limit: pageSize,
        query,
        field,
        order,
        status,
    }: MenuItemQueryDto): Promise<Pagination<MenuItemDetail>> {
        const queryBuilder = this.menuItemRepository
            .createQueryBuilder('menu-item')
            .leftJoinAndSelect('menu-item.historyPrices', 'historyPrices')
            .leftJoinAndSelect('menu-item.category', 'category')
            .where({
                ...(query ? { name: Like(`%${query}%`) } : null),
                ...(status ? { status } : null),
            })
            .orderBy(`menu-item.${field}`, order);

        return paginate<MenuItemEntity, MenuItemDetail>(
            queryBuilder,
            {
                page,
                pageSize,
            },
            source => this.mapper.mapArray(source, MenuItemEntity, MenuItemDetail)
        );
    }

    async getMenuItemById(id: number): Promise<MenuItemDetail> {
        const menuItem = await this.findOneById(id);
        return this.mapper.map(menuItem, MenuItemEntity, MenuItemDetail);
    }

    async infoList(): Promise<MenuItemInfo[]> {
        const menuItems = await this.menuItemRepository.find({
            where: { status: MenuItemStatus.ENABLED },
            relations: ['historyPrices'],
        });

        return this.mapper.mapArray(menuItems, MenuItemEntity, MenuItemInfo);
    }

    async create(dto: MenuItemDto) {
        const result = await this.entityManager.transaction(async manager => {
            const { categoryId, image, price, ...data } = dto;

            const category = await this.categoryService.findOneById(categoryId);
            const file = await this.fileService.saveFile(image);

            const menuItem = manager.create(MenuItemEntity, {
                ...data,
                category,
                image: file,
            });
            const newMenuItem = await manager.save(menuItem);

            const menuItemPrice = manager.create(MenuItemPriceEntity, {
                price,
                menuItem: newMenuItem,
            });

            await manager.save(menuItemPrice);

            return newMenuItem;
        });

        return result;
    }

    async update(id: number, dto: MenuItemUpdateDto): Promise<MenuItemDetail> {
        const result = await this.entityManager.transaction(async manager => {
            const menuItem = await this.findOneById(id);
            const { categoryId, image, price, ...data } = dto;

            if (categoryId) {
                const category = await this.categoryService.findOneById(categoryId);
                menuItem.category = category;
            }

            if (image) {
                const file = await this.fileService.saveFile(image);
                menuItem.image = file;
            }

            if (!isNil(price)) {
                const newPrice = manager.create(MenuItemPriceEntity, {
                    price,
                    menuItem,
                });
                await manager.save(newPrice);
            }

            const updatedMenuItem = { ...menuItem, ...data };
            return manager.save(updatedMenuItem);
        });

        return this.mapper.map(result, MenuItemEntity, MenuItemDetail);
    }

    async delete(id: number) {
        const menuItem = await this.findOneById(id);

        await Promise.all(
            menuItem.historyPrices.map(price => this.menuItemPriceRepository.remove(price))
        );
        await this.menuItemRepository.remove(menuItem);
    }

    async findCurrentPriceById(id: number): Promise<MenuItemPriceEntity> {
        return this.menuItemPriceRepository.findOne({
            where: { menuItem: { id } },
            order: { createdAt: 'DESC' },
        });
    }

    async findOneById(id: number): Promise<MenuItemEntity> {
        const menuItem = await this.menuItemRepository.findOne({
            where: { id },
            relations: ['historyPrices', 'category'],
        });
        if (!menuItem) {
            throw new NotFoundException('Menu item not found');
        }

        return menuItem;
    }
}