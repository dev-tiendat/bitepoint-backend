import { ApiProperty } from '@nestjs/swagger';

export class ParamConfigInfo {
    @ApiProperty({ description: 'Tên cấu hình', example: 'Mật khẩu khởi tạo' })
    name: string;

    @ApiProperty({ description: 'Key cấu hình', example: 'SYS_INIT_PASSWORD' })
    key: string;

    @ApiProperty({ description: 'Giá trị cấu hình', example: 'a123456' })
    value: string;

    @ApiProperty({ description: 'Ghi chú', example: 'Mật khẩu khởi tạo' })
    remark: string;

    @ApiProperty({ description: 'Ngày tạo' })
    createdAt: number;

    @ApiProperty({ description: 'Ngày cập nhật' })
    updatedAt: number;
}