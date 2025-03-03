export enum OrderStatus {
    ORDERING = 0,
    CANCELLED = 1,
    COMPLETED = 2,
}

export enum OrderPaymentStatus {
    UNPAID = 0,
    PAID = 1,
}

export enum OrderItemStatus {
    ORDERED = 1,
    PREPARING = 2,
    READY = 3,
    SERVED = 4,
    CANCELLED = 5,
}
