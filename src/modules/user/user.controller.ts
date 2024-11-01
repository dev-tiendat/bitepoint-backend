import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'users', version: '1' })
export class UserController {
    constructor() {}

    @Get()
    async getInfo() {
        return 'hello';
    }
}
