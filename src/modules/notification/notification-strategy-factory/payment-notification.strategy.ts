import { NotificationType } from '../notification.constant';
import { NotificationStrategy } from './notification-strategy.interface';

export class PaymentNotificationStrategy implements NotificationStrategy {
    canHandle(type: NotificationType): boolean {
        return (
            type === NotificationType.PAYMENT_SUCCESS ||
            type === NotificationType.PAYMENT_CUSTOMER_REQUEST_CASH_PAYMENT
        );
    }

    generateTitle(type: NotificationType, data: any): string {
        if (type === NotificationType.PAYMENT_SUCCESS) {
            return `Thanh toán thành công`;
        } else if (
            type === NotificationType.PAYMENT_CUSTOMER_REQUEST_CASH_PAYMENT
        ) {
            return `Khách hàng yêu cầu thanh toán bằng tiền mặt`;
        }
        return '';
    }

    generateMessage(type: NotificationType, data: any): string {
        if (type === NotificationType.PAYMENT_SUCCESS) {
            return `Đã thanh toán thành công cho bàn ăn ${data.tableName} với số tiền ${data.totalAmount}`;
        } else if (
            type === NotificationType.PAYMENT_CUSTOMER_REQUEST_CASH_PAYMENT
        ) {
            return `Khách hàng yêu cầu thanh toán bằng tiền mặt cho bàn ăn ${data.tableName}`;
        }
        return '';
    }
}
