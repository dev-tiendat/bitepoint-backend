import { NotificationType } from '../notification.constant';
import { NotificationStrategy } from './notification-strategy.interface';

export class OrderNotificationStrategy implements NotificationStrategy {
    canHandle(type: NotificationType): boolean {
        return (
            type === NotificationType.ORDER_CHECK_IN ||
            type === NotificationType.ORDER_URGE
        );
    }

    generateTitle(type: NotificationType, data: any): string {
        if (type === NotificationType.ORDER_CHECK_IN) {
            return `Khách hàng check in`;
        } else if (type === NotificationType.ORDER_URGE) {
            return `Khách hàng giục ra món`;
        }
        return '';
    }

    generateMessage(type: NotificationType, data: any): string {
        if (type === NotificationType.ORDER_CHECK_IN) {
            const tableNames = data.tables.map(table => table.name).join(', ');
            return `Khách hàng đã check in bàn ăn ${tableNames}`;
        } else if (type === NotificationType.ORDER_URGE) {
            return `Khách hàng đang giục ưu tiên ra món ăn ${data.itemName} - Bàn ăn ${data.tableName}`;
        }
        return '';
    }
}
