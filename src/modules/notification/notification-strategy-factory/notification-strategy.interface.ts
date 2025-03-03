import { NotificationType } from '../notification.constant';

export interface NotificationStrategy {
    canHandle(type: NotificationType): boolean;
    generateTitle(type: NotificationType, data: any): string;
    generateMessage(type: NotificationType, data: any): string;
}
