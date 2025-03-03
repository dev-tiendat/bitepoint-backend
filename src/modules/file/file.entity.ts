import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntity } from '~/common/entity/common.entity';

import { UserEntity } from '../user/user.entity';

@Entity({ name: 'file' })
export class FileEntity extends CommonEntity {
    @Column({ name: 'file_name', nullable: true })
    @ApiProperty({ description: 'Tên file' })
    fileName: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Đường dẫn file' })
    path: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Kiểu loại file' })
    type: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'File dạng private' })
    isPrivate: boolean;

    @ApiHideProperty()
    @ManyToOne(() => UserEntity, user => user.files)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
