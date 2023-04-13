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

export enum GENDER {
    MEN = 0,
    WOMEN = 1,
    UNISEX = 3
}

export enum PAYMENT_METHOD {
    CARD = 1,
    DELIVERY = 2
}

export enum STATUS_ORDER {
    WAITING_PAYMENT = 0,
    ORDER = 1,
    APPROVE_ORDER = 2,
    PACK_ORDER = 3,
    DELIVERING = 4,
    COMPLETE_ORDER = 5,
    CANCEL_ORDER = 6,
}