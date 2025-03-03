import { NotificationType } from '../notification.constant';
import { NotificationStrategy } from './notification-strategy.interface';

export class TableNotificationStrategy implements NotificationStrategy {
    canHandle(type: NotificationType): boolean {
        return (
            type === NotificationType.TABLE_CLEANED ||
            type === NotificationType.TABLE_ASSIGNED
        );
    }

    generateTitle(type: NotificationType, data: any): string {
        if (type === NotificationType.TABLE_CLEANED) {
            return `Bàn ăn đã được dọn dẹp`;
        } else if (type === NotificationType.TABLE_ASSIGNED) {
            return `Bàn ăn đã được sử dụng`;
        }
        return '';
    }

    generateMessage(type: NotificationType, data: any): string {
        if (type === NotificationType.TABLE_CLEANED) {
            return `Bàn ăn ${data.tableName} đã được dọn dẹp sẵn sàng phục vụ khách hàng`;
        } else if (type === NotificationType.TABLE_ASSIGNED) {
            return `Bàn ăn ${data.tableName} đã được sử dụng bởi khách hàng ${data.customerName}`;
        }
        return '';
    }
}
