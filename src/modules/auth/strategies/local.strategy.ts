import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthStrategy } from '../auth.constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(
    Strategy,
    AuthStrategy.LOCAL
) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'usernameOrPhone',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
