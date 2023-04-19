import { SALEOFF_TYPE } from "src/enum";

export const LOCALE_DEFAULT = 'vn_vi';
export const SERVER_API_URL = process && process.env.SERVER_API_URL;
export const GHN_TOKEN = 'c26fbc83-124e-11ed-b136-06951b6b7f89'
export const SHOP_ID = 117267
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

export const DELIVERY_ORDER = [
    {
        id: 1,
        code: "CHOXEMHANGKHONGTHU",
        label: "Cho xem hàng, không cho thử"
    },
    {
        id: 2,
        code: "CHOTHUHANG",
        label: "Cho xem hàng, cho thử"
    },
    {
        id: 3,
        code: "KHONGCHOXEMHANG",
        label: "Không cho xem hàng"
    }
];

export const PAYMENT_TYPE = [
    {
        id: 1,
        label: "Chuyển khoản"
    },
    {
        id: 2,
        label: "Tiền mặt"
    }
];

export const REASON_OPTION = [
    {
        id: 1,
        name: "Hàng hỏng"
    },
    {
        id: 2,
        name: "Hàng lỗi"
    },
    {
        id: 3,
        name: "Lý do khác"
    }
];

export const SALEOFF_OPTION = [
    {
        id: SALEOFF_TYPE.CATEGORY,
        name: "Chiết khấu theo danh mục sản phẩm"
    },
    {
        id: SALEOFF_TYPE.PRODUCT,
        name: "Chiết khấu theo sản phẩm"
    },
];

export const GENDER_OPTION = [
    {
        id: 1,
        name: "Nam"
    },
    {
        id: 2,
        name: "Nữ"
    },
    {
        id: 3,
        name: "Unisex"
    }
]

export const DISCOUNT_TYPE = [
    {
        id: 1,
        name: "Giá trị"
    },
    {
        id: 2,
        name: "Phần trăm"
    },
]