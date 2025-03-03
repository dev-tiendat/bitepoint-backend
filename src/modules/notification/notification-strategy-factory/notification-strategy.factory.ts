import { NotificationType } from '../notification.constant';
import { NotificationStrategy } from './notification-strategy.interface';
import { OrderNotificationStrategy } from './order-notification.strategy';
import { PaymentNotificationStrategy } from './payment-notification.strategy';
import { ReservationNotificationStrategy } from './reservation-notification.strategy';
import { TableNotificationStrategy } from './table-notification.strategy';

export class NotificationStrategyFactory {
    private static strategies: NotificationStrategy[] = [
        new OrderNotificationStrategy(),
        new ReservationNotificationStrategy(),
        new TableNotificationStrategy(),
        new PaymentNotificationStrategy(),
    ];

    static getStrategy(type: NotificationType): NotificationStrategy {
        const strategy = this.strategies.find(strategy =>
            strategy.canHandle(type)
        );
        if (!strategy) {
            throw new Error('Unknown notification type');
        }
        return strategy;
    }
}
