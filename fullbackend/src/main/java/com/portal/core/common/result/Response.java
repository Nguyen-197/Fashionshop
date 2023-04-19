package com.portal.core.common.result;

import com.portal.core.common.utils.Constants;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Response {
    private String type;
    private String code;
    private String message;
    private Object data;

    public Response(String type, String code, String message, Object data) {
        this.type = type;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public Response(String type, String code, Object data) {
        this.type = type;
        this.code = code;
        this.data = data;
    }

    public Response(String type, String code) {
        this.type = type;
        this.code = code;
    }

    public Response(String type) {
        this.type = type;
    }

    public static Response success(String code) {
        return new Response(Constants.RESPONSE_TYPE.SUCCESS, code);
    }

    public static Response success() {
        return new Response(Constants.RESPONSE_TYPE.SUCCESS);
    }

    public static Response error(String code) {
        return new Response(Constants.RESPONSE_TYPE.ERROR, code);
    }

    public static Response warning(String code) {
        return new Response(Constants.RESPONSE_TYPE.WARNING, code);
    }

    public static Response success(String code, String message) {
        return new Response(Constants.RESPONSE_TYPE.SUCCESS, code, message, null);
    }

    public static Response invalidPermission() {
        return new Response(Constants.RESPONSE_TYPE.ERROR, "invalidPermission");
    }

    public Response withData(Object data) {
        this.data = data;
        return this;
    }

    public Response withMessage(String message) {
        this.message = message;
        return this;
    }
}
