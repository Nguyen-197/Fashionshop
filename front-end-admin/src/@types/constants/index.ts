import { PAYMENT_STATUS, STATUS_ORDER } from "src/enum";

export const GHN_TOKEN = 'c26fbc83-124e-11ed-b136-06951b6b7f89'
export const SHOP_ID = 117267
export const STATUS_ORDERS = [
    {
        id: STATUS_ORDER.WAITING_PAYMENT,
        name: "Chờ thanh toán",
        className: "p-danger text-normal"
    },
    {
        id: STATUS_ORDER.ORDER,
        name: "Chờ xác nhận",
        className: "p-danger",
    },
    {
        id: STATUS_ORDER.APPROVE_ORDER,
        name: "Chờ lấy hàng",
        className: "p-warning"
    },
    {
        id: STATUS_ORDER.PACK_ORDER,
        name: "Chờ nhận hàng",
        className: "p-warning"
    },
    {
        id: STATUS_ORDER.DELIVERING,
        name: "Đang giao",
        className: "p-warning"
    },
    {
        id: STATUS_ORDER.COMPLETE_ORDER,
        name: "Đã giao",
        className: "p-success"
    },
    {
        id: STATUS_ORDER.CANCEL_ORDER,
        name: "Đã hủy",
        className: "p-danger"
    }
];

export const PAYMENTS_STATUS = [
    {
        id: PAYMENT_STATUS.UNPAID,
        name: "Chưa thanh toán",
    },
    {
        id: PAYMENT_STATUS.PAID,
        name: "Đã thanh toán",
    },
];

export const STATUS_REFUND = [
    {
        id: PAYMENT_STATUS.UNPAID,
        name: "Chưa thanh toán",
        className: "p-danger"
    },
    {
        id: PAYMENT_STATUS.PAID,
        name: "Đã thanh toán",
        className: "p-success"
    },
];

export const ORDER_RETURN_STATUS = [
    {
        id: 1,
        name: "Chờ xác nhận",
        className: "p-waring"
    },
    {
        id: 2,
        name: "Chưa nhận lại hàng",
        className: "p-danger"
    },
    {
        id: 3,
        name: "Đã nhận lại hàng",
        className: "p-success"
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

export const SALE_OFF_STATUS = [
    {
        id: 1,
        name: "Đang chạy",
        className: "p-success"
    },
    {
        id: 2,
        name: "Không hoạt động",
        className: "p-danger"
    },
]

export const REPORT_DAY = [
    {
        id: 1,
        value: 7,
        name: "7 ngày"
    },
    {
        id: 2,
        value: 14,
        name: "14 ngày"
    },
    {
        id: 3,
        value: 30,
        name: "30 ngày"
    },
]

export const BUSSINESS_OPTION = [
    {
        id: 1,
        value: 0,
        name: "Đang kinh doanh"
    },
    {
        id: 2,
        value: 1,
        name: "Ngừng khinh doanh"
    },
]