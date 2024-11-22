import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MenuItemEntity } from './menu-item.entity';
import { MenuItemDto, MenuItemUpdateDto } from './menu-item.dto';
import { FileService } from '../file/file.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class MenuItemService {
    constructor(
        @InjectRepository(MenuItemEntity)
        private menuItemRepository: Repository<MenuItemEntity>,
        private fileService: FileService,
        private categoryService: CategoryService
    ) {}

    async create(dto: MenuItemDto) {
        const { categoryId, image, ...data } = dto;
        const category =
            await this.categoryService.findCategoryById(categoryId);
        const file = await this.fileService.saveFile(image);

        const menuItem = this.menuItemRepository.create({
            ...data,
            category,
            image: file,
        });

        await this.menuItemRepository.save(menuItem);

        return menuItem;
    }

    async update(id: number, dto: MenuItemUpdateDto) {
        const menuItem = await this.findMenuItemById(id);
        const { categoryId, image, ...data } = dto;
        if (categoryId) {
            const category = await this.categoryService.findCategoryById(
                dto.categoryId
            );
            menuItem.category = category;
        }

        if (image) {
            const file = await this.fileService.saveFile(dto.image);
            menuItem.image = file;
        }

        await this.menuItemRepository.save({
            ...menuItem,
            ...data,
        });
    }

    async delete(id: number) {
        const menuItem = await this.findMenuItemById(id);
        await this.menuItemRepository.remove(menuItem);
    }

    async findMenuItemById(id: number): Promise<MenuItemEntity> {
        const menuItem = await this.menuItemRepository.findOneBy({ id });
        if (!menuItem) {
            throw new NotFoundException('Menu item not found');
        }

        return menuItem;
    }
}
