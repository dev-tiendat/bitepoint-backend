import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserProfile } from './user.profile';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../system/role/role.module';

const providers = [UserService, UserProfile];

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        RoleModule,
        forwardRef(() => AuthModule),
    ],
    controllers: [UserController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class UserModule {}
