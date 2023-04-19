package com.portal.core.common.utils;

import org.apache.commons.beanutils.Converter;

public class StringToDateConverter implements Converter {
    @Override
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public Object convert(Class type, Object value) {
        if (value == null) {
            return null;
        } else if (value instanceof String) {
            try {
                return CommonUtils.convertStringToDate(value.toString());
            } catch (Exception ex) {
                return ex;
            }
        } else {
            return value;
        }
    }
}
