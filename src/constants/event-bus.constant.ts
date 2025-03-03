export enum EventBusEvents {
    TokenExpired = 'token.expired',
    SystemException = 'system.exception',

    PaymentCreated = 'payment.created',
    PaymentHistoryUpdated = 'payment.history-updated',
    PaymentSuccess = 'payment.success',

    NotificationSend = 'notification.send',

    GatewayStopCron = 'gateway.stop-cron',
    GatewayStartCron = 'gateway.start-cron',
    GatewayCronErrorStreak = 'gateway.cron-error-streak',
    GatewayCronRecovery = 'gateway.cron-recovery',
}
