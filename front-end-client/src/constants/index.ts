import { STATUS_ORDER } from 'src/@types/enums';
export const LOCALE_DEFAULT = 'vn_vi';
export const SERVER_API_URL = process && process.env.SERVER_API_URL;

export const AUTH_TOKEN_KEY = 'sb-access-token';
export const IS_OPEN_FEEDBACK = 'isOpenFeedback';
export const AUTH_REFRESH_TOKEN_KEY = 'sb-refesh-token';
export const CHECK_RESPONSE_FROM_SAML = 'response_saml';
export const SIGNOUT_SAML_URL = 'signOutSaml';
export const MENU = 'menu';

export const DEFAULT_TIMEZONE = 'Asia/Tokyo';
export const USER_FORMAT_DATE_KEY = 'userFormatDateKey';
export const APP_DATE_FORMAT_ES = 'YYYY-MM-DD';

export const RESPONSE_TYPE = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    WARNING: 'WARNING'
}

export const RESPONSE_CODE = {
    ERROR_VALIDATE: "ERROR_VALIDATE",
    DUPLICATE_CODE: "duplicate.code",
    INVALID_VERIFY_ACCOUNT: "common.account.invalid.verify",
    TOKEN_EXPIRED: "common.token.expired",
    TOKEN_INVALID: "common.token.invalid"
}

export const LOCALE_OPTIONS = [
    {
        id: 'vn_vi',
        name: 'Việt nam'
    },
    {
        id: 'en',
        name: 'English'
    }
];

export const STATUS_ORDERS = [
    {
        id: STATUS_ORDER.WAITING_PAYMENT,
        name: "Chờ thanh toán",
        className: "text-normal"
    },
    {
        id: STATUS_ORDER.ORDER,
        name: "Chờ xác nhận",
        className: "text-primary"
    },
    {
        id: STATUS_ORDER.APPROVE_ORDER,
        name: "Chờ lấy hàng",
        className: "text-primary"
    },
    {
        id: STATUS_ORDER.PACK_ORDER,
        name: "Chờ đóng gói"
    },
    {
        id: STATUS_ORDER.DELIVERING,
        name: "Chờ nhận hàng"
    },
    {
        id: STATUS_ORDER.COMPLETE_ORDER,
        name: "Đã giao"
    },
    {
        id: STATUS_ORDER.CANCEL_ORDER,
        name: "Đã hủy"
    }
];