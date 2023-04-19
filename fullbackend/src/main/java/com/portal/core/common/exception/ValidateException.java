package com.portal.core.common.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ValidateException extends SysException {
    private static final long serialVersionUID = 1L;
    private String code;
    private String message;

    /**
     *
     * ValidateException
     * @Param code
     */
    public ValidateException(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
