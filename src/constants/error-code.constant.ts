export enum ErrorCode {
    DEFAULT = '0:Unknown error',
    SERVER_ERROR = '500:Service is busy, please try again later',

    SYSTEM_USER_EXISTS = '1001: System user already exists',
    USER_NOT_FOUND = '1017:User does not exist',
}
