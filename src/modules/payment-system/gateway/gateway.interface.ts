export enum GateWayType {
    MB_BANK = 'mb_bank',
    TP_BANK = 'tp_bank',
}

export interface Payment {
    transaction_id: string;
    content: string;
    amount: number;
    date: Date;
    gate: GateWayType;
    account_receiver: string;
}

export interface GateConfig {
    name: string;
    type: GateWayType;
    password?: string;
    loginId?: string;
    account: string;
    token: string;
    repeatIntervalInSec: number;
    proxy?: string;
    deviceId?: string;
    getTransactionDayLimit: number;
    getTransactionCountLimit: number;
}
