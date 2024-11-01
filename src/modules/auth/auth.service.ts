import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { UserService } from '../user/user.service';
import { BusinessException } from '~/common/exceptions/biz.exception';
import { ErrorCode } from '~/constants/error-code.constant';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async validateUser(credential: string, password: string) {
        const user = this.userService.findUserByUsername(credential);

        if (isEmpty(user))
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);

        // const comparePassword = md
    }
}
