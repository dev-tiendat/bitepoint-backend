import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';

const providers = [RoleService];

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity])],
    controllers: [RoleController],
    providers: [...providers],
    exports: [TypeOrmModule, ...providers],
})
export class RoleModule {}
