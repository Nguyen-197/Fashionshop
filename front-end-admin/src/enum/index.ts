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

export enum STATUS_ORDER {
    WAITING_PAYMENT = 0,
    ORDER = 1,
    APPROVE_ORDER = 2,
    PACK_ORDER = 3,
    DELIVERING = 4,
    COMPLETE_ORDER = 5,
    CANCEL_ORDER = 6,
}

export enum PAYMENT_STATUS {
    UNPAID = 1,
    PAID = 2
}

export enum PAYMENT_METHOD {
    PICK_UP_SHOP = 1,
    GHN = 2,
}

export enum PAYMENT_TYPE {
    ONLINE = 1,
    COD = 2
}

export enum STATUS_REFUND {
    UNPAID = 1,
    PAID = 2
}

export enum DELIVERY_TYPE {
    PICK_UP_SHOP = 1,
    GHN = 2
}

export enum RETURN_ORDER_STATUS {
    WAITING_APPROVE = 1, // Chờ xác nhận
    NOT_YET_RECEIVED = 2, // Chưa nhận lại hàng
    ITEM_RECEIVED = 3 // Đã nhận lại hàng
}

export enum RETURN_TYPE {
    RETURN = 1,
    EXCHANGE = 2
}

export enum SALEOFF_TYPE {
    CATEGORY = 1,
    PRODUCT = 2,
}

export enum BUSSINESS_TYPE {
    STOP = 1,
    CONTINUE = 2
}

export enum SALEOFF_STATUS {
    LIVE = 1,
    OFFLINE = 2
}