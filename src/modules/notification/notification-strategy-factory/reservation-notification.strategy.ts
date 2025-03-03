import { NotificationType } from '../notification.constant';
import { NotificationStrategy } from './notification-strategy.interface';

export class ReservationNotificationStrategy implements NotificationStrategy {
    canHandle(type: NotificationType): boolean {
        return (
            type === NotificationType.RESERVATION_CREATED ||
            type === NotificationType.RESERVATION_CANCELED
        );
    }

    generateTitle(type: NotificationType, data: any): string {
        if (type === NotificationType.RESERVATION_CREATED) {
            return `Đặt bàn mới`;
        } else if (type === NotificationType.RESERVATION_CANCELED) {
            return `Hủy đặt bàn`;
        }
        return '';
    }

    generateMessage(type: NotificationType, data: any): string {
        if (type === NotificationType.RESERVATION_CREATED) {
            return `Đã đặt bàn mới thành công cho khách hàng ${data.customerName}.`;
        } else if (type === NotificationType.RESERVATION_CANCELED) {
            return `Đã hủy đặt bàn cho khách hàng ${data.customerName}`;
        }
        return '';
    }
}
