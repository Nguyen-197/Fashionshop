package com.portal.core.common.base.controller;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerMethod;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public abstract class BaseController {

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.setAutoGrowCollectionLimit(8*1024);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

    /**
     * handleValidateException
     *
     * @param ex            ex
     * @param req           req
     * @param handlerMethod handlerMethod
     * @return Response
     */
    @ExceptionHandler(ValidateException.class)
    public Response handleValidateException(ValidateException ex, HttpServletRequest request, HandlerMethod handlerMethod) {
        return Response.warning(ex.getCode()).withMessage(ex.getMessage());
    }

}
