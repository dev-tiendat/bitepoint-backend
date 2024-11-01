import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { RoleModule } from '../system/role/role.module';

const providers = [UserService];

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), RoleModule],
    controllers: [UserController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class UserModule {}
