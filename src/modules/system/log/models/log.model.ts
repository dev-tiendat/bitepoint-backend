import { ApiProperty } from '@nestjs/swagger';

export class LoginLogInfo {
    @ApiProperty({ description: 'Mã nhật ký' })
    id: number;

    @ApiProperty({ description: 'IP đăng nhập', example: '1.1.1.1' })
    ip: string;

    @ApiProperty({ description: 'Địa chỉ đăng nhập' })
    address: string;

    @ApiProperty({ description: 'Hệ điều hành', example: 'Windows 10' })
    os: string;

    @ApiProperty({ description: 'Trình duyệt', example: 'Chrome' })
    browser: string;

    @ApiProperty({ description: 'Tên người dùng đăng nhập', example: 'admin' })
    username: string;

    @ApiProperty({
        description: 'Thời gian đăng nhập',
        example: '2023-12-22 16:46:20.333843',
    })
    time: string;
}
