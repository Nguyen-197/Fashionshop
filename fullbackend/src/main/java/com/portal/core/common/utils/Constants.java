package com.portal.core.common.utils;

public class Constants {

    public static class RESPONSE_TYPE {

        public static final String SUCCESS = "SUCCESS";
        public static final String ERROR = "ERROR";
        public static final String WARNING = "WARNING";
        public static final String CONFIRM = "CONFIRM";
        public static final String invalidPermision = "invalidPermission";
    }

    public static class RESPONSE_CODE {

        public static final String SUCCESS = "success";
        public static final String CREATE_SUCCESS = "common.created";
        public static final String UPDATE_SUCCESS = "common.updated";
        public static final String DELETE_SUCCESS = "common.deleted";
        public static final String ERROR = "error";
        public static final String WARNING = "warning";
        public static final String RECORD_DELETED = "record.delete";
        public static final String DUPLICATE_CODE = "duplicate.code";
        public static final String DUBLICATE_EMAIL = "duplicate.email";
        public static final String DUBLICATE_PHONENUMBER = "duplicate.phonenumber";
        public static final String SERVER_ERROR = "server.error";
        public static final String TOKEN_VALID = "token_valid";
        public static final String CANNOT_CHOOSE_CATEGORY_PARENT = "cannot_choose_category_parent";
        public static final String TOKEN_EXPIRED = "common.token.expired";
        public static final String TOKEN_INVALID = "common.token.invalid";
        public static final String INVALID_VERIFY_ACCOUNT = "common.account.invalid.verify";
        public static final String MISSING_PARAM = "common.missing.param";
        public static final String QUANTITY_INVALID = "common.quantity.invalid";
        public static final String CANCEL_SUCCESS = "common.cancel.success";
        public static final String ACTION_SUCCESS = "common.action.success";
        public static final String ACTION_ERROR = "common.action.error";
        public static final String CHANGE_SUCCESS = "change.success";
        public static final String CHANGE_ERROR = "change.error";
    }
    public static class PAYMENT_TYPE {
        public static final Integer VN_PAY = 1;
        public static final Integer COD = 2;
    }

    public static class STATUS_ORDER {
        public static final Integer WAITING_PAYMENT = 0;
        public static final Integer ORDER = 1;
        public static final Integer APPROVE_ORDER = 2;
        public static final Integer PACK_ORDER = 3;
        public static final Integer DELIVERING = 4;
        public static final Integer COMPLETE_ORDER = 5;
        public static final Integer CANCEL_ORDER = 6;
    }

    public static class PAYMENT_STATUS {
        public static final Integer UNPAID = 1; // Chưa thanh toán
        public static final Integer PAID = 2;   // Đã thanh toán
    }

    public static class DELIVERY_TYPE {
        public static final Integer INSTORE = 1;
        public static final Integer INDELIVERY = 2;
    }

    public static class STATUS_RETURN {
        public static final Integer WAITING_APPROVE = 1;    // Chờ xác nhận
        public static final Integer NOT_YET_RECEIVED = 2;   // Chưa nhận lại hàng
        public static final Integer ITEM_RECEIVED = 3;      // Đã nhận lại hàng
    }

    public static class STATUS_REFUND {
        public static final Integer UNPAID = 1; // Chưa thanh toán
        public static final Integer PAID = 2;   // Đã thanh toán
    }

    public static class PROMOTION_STATUS {
        public static final Integer ACTIVE = 1; // Hoạt động
        public static final Integer INACTIVE = 2;   // Ngừng hoạt động
    }

    public static class PROMOTION_TYPE {
        public static final Integer IN_CATEGORY = 1; // KM theo danh mục
        public static final Integer IN_PRODUCT = 2;   // KM theo sản phẩm
    }

    public static class DISCOUNT_TYPE {
        public static final Integer IN_VALUE = 1; // KM theo giá trị
        public static final Integer IN_PERCENT = 2;   // KM theo phần trăm
    }
}
