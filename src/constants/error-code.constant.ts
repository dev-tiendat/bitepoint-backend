export enum ErrorCode {
    DEFAULT = '0:Unknown error',
    SERVER_ERROR = '500:Service is busy, please try again later',

    SYSTEM_USER_EXISTS = '1001:System user already exists',
    INVALID_USERNAME_PASSWORD = '1002:Username and password are incorrect',
    USER_NOT_FOUND = '1003:User does not exist',
    PERMISSION_REQUIRES_PARENT = '1004:Permissions must include the parent node',
    PARENT_MENU_NOT_FOUND = '1005:Parent menu does not exist',
    ILLEGAL_OPERATION_DIRECTORY_PARENT = '1006:Illegal operation: This node only supports directory type parent nodes',
    PASSWORD_MISMATCH = '1007:The old password is inconsistent with the original password',

    INVALID_LOGIN = '1101:Invalid login, please log in again',
    PASSWORD_CHANGED = '1102:The password has been changed elsewhere, please login again',
    ACCOUNT_LOGGED_IN_ELSEWHERE = '1103:Our account has been logged in elsewhere',
    REFRESH_TOKEN_INVALID = '1104:Invalid refresh token, please log in again',
}
