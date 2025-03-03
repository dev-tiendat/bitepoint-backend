import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsIn, Matches, ValidateIf } from 'class-validator';
import { OperatorDto } from '~/common/dto/operator.dto';
import { MenuType } from './menu.constant';
import {
    BooleanField,
    NumberField,
    StringField,
} from '~/common/decorators/field.decorator';

export class MenuDto extends OperatorDto {
    @ApiProperty({
        description: `
Kiểu Menu:
- 0: Menu chính
- 1: Mục lục
- 2: Quyền   
    `,
        enum: MenuType,
        example: MenuType.MENU_GROUP,
    })
    @IsEnum(MenuType)
    type: MenuType;

    @ApiProperty({ description: 'Menu gốc', example: null })
    @NumberField({
        int: true,
        required: false,
    })
    parentId: number;

    @ApiProperty({
        description: 'Tên Menu hoặc quyền',
        example: 'Quản lý Menu',
    })
    @StringField({
        minLength: 2,
        required: false,
    })
    name: string;

    @ApiProperty({ description: 'Thứ tự', example: 1 })
    @NumberField({
        int: true,
        min: 0,
    })
    orderNo: number;

    @ApiProperty({ description: 'Đường dẫn', example: '/menu' })
    @StringField({
        required: false,
    })
    // @Matches(/^[/]$/)
    @ValidateIf(o => o.type !== MenuType.PERMISSION)
    path: string;

    @ApiProperty({ description: 'Liên kết ngoài', default: false })
    @ValidateIf(o => o.type !== MenuType.PERMISSION)
    @BooleanField({})
    isExt: boolean;

    @ApiProperty({ description: 'Cách mở liên kết ngoài', default: 1 })
    @ValidateIf((o: MenuDto) => o.isExt)
    @IsIn([1, 2])
    extOpenMode: number;

    @ApiProperty({ description: 'Menu hiển thị không', default: 1 })
    @ValidateIf((o: MenuDto) => o.type !== MenuType.PERMISSION)
    @IsIn([0, 1])
    show: number;

    @ApiProperty({
        description:
            'Đặt mục menu được đánh dấu của tuyến đường hiện tại, thường được sử dụng trên trang chi tiết',
    })
    @ValidateIf((o: MenuDto) => o.type !== MenuType.PERMISSION && o.show === 0)
    @StringField({
        required: false,
    })
    activeMenu?: string;

    @ApiProperty({
        description: 'Có bật bộ nhớ đệm trang hay không',
        default: 1,
    })
    @ValidateIf((o: MenuDto) => o.type === 1)
    @IsIn([0, 1])
    keepAlive: number;

    @ApiProperty({ description: 'Trạng thái', default: 1 })
    @IsIn([0, 1])
    status: number;

    @ApiProperty({ description: 'Biểu tượng menu' })
    @ValidateIf((o: MenuDto) => o.type !== MenuType.PERMISSION)
    @StringField({
        required: false,
    })
    icon?: string;

    @ApiProperty({ description: 'Quyền truy cập', example: 'menu:list' })
    @ValidateIf((o: MenuDto) => o.type === MenuType.PERMISSION)
    @StringField({
        required: false,
    })
    permission: string;

    @ApiProperty({ description: 'Đường dẫn path hoặc liên kết ngoài' ,example: '/menu/index' })
    @ValidateIf((o: MenuDto) => o.type !== MenuType.PERMISSION)
    @StringField({
        required: false,
    })
    component?: string;
}

export class MenuUpdateDto extends PartialType(MenuDto) {}

export class MenuQueryDto extends PartialType(
    PickType(MenuDto, [
        'name',
        'path',
        'permission',
        'component',
        'status',
        'type',
    ])
) {}
