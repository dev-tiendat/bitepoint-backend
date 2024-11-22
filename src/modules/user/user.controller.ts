import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiTags } from '@nestjs/swagger';

@Controller({
    path: 'users',
    version: '1',
})
@ApiTags('User - Mô đun quản lý người dùng')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    // @FormDataRequest()
    async getInfo(@Body() userDto: UserDto) {
        console.log(userDto);

        // return this.userService.findUserByUsername(userDto.username);
        // return null;
    }
}
