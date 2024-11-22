import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../auth.constant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalGuard extends AuthGuard(AuthStrategy.LOCAL) {
    async canActivate(): Promise<boolean> {
        return true;
    }
}
