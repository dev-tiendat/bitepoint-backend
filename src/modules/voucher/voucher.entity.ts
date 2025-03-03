import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '~/common/entity/common.entity';
import { OrderEntity } from '../order/entities/order.entity';

@Entity('sys_voucher')
export class VoucherEntity extends CommonEntity {
    @AutoMap()
    @Column({ length: 255 })
    name: string;

    @AutoMap()
    @Column({ length: 50, unique: true })
    code: string;

    @AutoMap()
    @Column({ type: 'decimal' })
    discount: number;

    @AutoMap()
    @Column({ type: 'date' })
    expirationDate: Date;

    @OneToMany(() => OrderEntity, order => order.voucher)
    orders: OrderEntity[];
}
