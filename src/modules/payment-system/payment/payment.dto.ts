import { PaymentMethod } from './payment.constant';

export class PaymentDto {
    orderId: string;
    paymentMethod: PaymentMethod;
}
