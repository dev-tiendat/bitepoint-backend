import { TableCustomerInfo } from '../order/order.model';

export class Stats {
    totalEarning: number;

    totalOrder: number;

    ordersCompleted: number;
}

export class PopularMenuItem {
    name: string;

    image: string;

    quantity: number;
}

export class ReservationInfo {
    reservationId: number;
    customerName: string;
    guestCount: number;
    phone: string;
    reservationTime: number;
}

export class StatisticsDetail {
    stats?: Stats;

    popularMenuItems?: PopularMenuItem[];

    reservations?: ReservationInfo[];
}
