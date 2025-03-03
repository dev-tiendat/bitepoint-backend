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
    INVALID_VERIFICATION_CODE = '1008:Invalid verification code',
    TOO_MANY_REQUESTS = '1009:The request frequency is too fast, please try again in one minute',
    MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY = '1010:Up to five verification codes can be sent per day',
    VERIFICATION_CODE_SEND_FAILED = '1203:Failed to send verification code',

    INVALID_LOGIN = '1101:Invalid login, please log in again',
    PASSWORD_CHANGED = '1102:The password has been changed elsewhere, please login again',
    ACCOUNT_LOGGED_IN_ELSEWHERE = '1103:Our account has been logged in elsewhere',
    ACCESS_TOKEN_INVALID = '1104:Invalid access token, please log in again',
    ACCESS_TOKEN_EXPIRED = '1105:Access token expired, please log in again',
    REFRESH_TOKEN_INVALID = '1106:Invalid refresh token, please log in again',
    REFRESH_TOKEN_EXPIRED = '1107:Refresh token expired, please log in again',
    NO_PERMISSION = '1108:No permission',

    VOUCHER_NOT_FOUND = '1201:Voucher not found',
    VOUCHER_EXPIRED = '1202:Voucher has expired',
}

export enum WsErrorCode {
    DEFAULT = '0:Unknown error',
    INVALID_DATA = '1001:Invalid data',
}
