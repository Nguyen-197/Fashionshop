package com.portal.project.utils;

public class Constants {
    public static class RESPONSE_TYPE {
        public static final String SUCCESS = "SUCCESS";
        public static final String ERROR = "ERROR";
        public static final String WARNING = "WARNING";
        public static final String CONFIRM = "CONFIRM";
        public static final String invalidPermission = "invalidPermission";
    }

    public static class RESPONSE_CODE {
        public static final String SUCCESS = "success";
        public static final String SAVE_SUCCESS = "save-success";
        public static final String DELETE_SUCCESS = "delete-success";
        public static final String ERROR = "error";
        public static final String WARNING = "warning";
        public static final String RECORD_DELETED = "record-deleted";
        public static final String SERVER_ERROR = "server.error";
        public static final String INVALID_VERIFY_ACCOUNT = "common.account.invalid.verify";
        public static final String ALREADY_ACCOUNT = "already.account";
        public static final String LOGIN_UNAUTHORIZED = "login_unauthorized";
        public static final String ACCOUNT_LOCK = "account_lock";
        public static final String ACCOUNT_TOO_MANY_LOGIN = "account_too_many_login";
        public static final String LOGIN_INVALID_CREDENTIALS = "login_invalid_credentials";
        public static final String LOGIN_USERNAME_NOT_EXIST = "username_not_exist";
        public static final String LOGIN_PASSWORD_INCORRECT = "password_incorrect";
        public static final String TOKEN_EXPIRED = "common.token.expired";
        public static final String TOKEN_INVALID = "common.token.invalid";
    }

    public static class HTTP_METHOD {
        public static final String GET = "GET";
        public static final String POST = "POST";
        public static final String PUT = "PUT";
        public static final String DELETE = "DELETE";
    }

    public static class MAX_LOGIN_FAILED {
        public static final Long FACEBOOK = 5L;
    }

    public interface AUTHENTICATE {
        String AUTHENTICATED = "AUTHENTICATED";
        String USER_DISABLED = "USER_DISABLED";
        String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    }

    public interface IS_LOCK {
        public static final Long LOCK = 1L;
        public static final Long NO_LOCK = 2L;
    }

    public enum MemberType {
        USER(1L, "USER"),
        ADMIN(2L, "ADMIN");

        private Long value;
        private String role;

        private MemberType(Long value, String role) {
            this.value = value;
            this.role = role;
        }

        public static String getRole(Long value) {
            for (MemberType type : MemberType.values()) {
                if (type.value.equals(value)) {
                    return type.role;
                }
            }
            return null;
        }

        public Long getValue() {
            return value;
        }

        public void setValue(Long value) {
            this.value = value;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
}
