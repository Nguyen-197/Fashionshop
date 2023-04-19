/* eslint-disable no-unused-vars */
export enum AUTHORITIES {
    GUEST = 'GUEST',
    ADMIN = 'ADMIN',
    STAFF = 'STAFF'
};

export enum RESPONSE_TYPE {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    WARNING = 'WARNING'
};

export enum RESPONSE_CODE {
    ERROR_VALIDATE = "ERROR_VALIDATE",
    DUPLICATE_CODE = "duplicate.code",
    INVALID_VERIFY_ACCOUNT = "common.account.invalid.verify",
    TOKEN_EXPIRED = "common.token.expired",
    TOKEN_INVALID = "common.token.invalid"
}

export enum ActionType {
    None,
    Request,
    Error,
    Success
}
