package com.portal.core.common.utils;

import java.util.Date;

import org.apache.commons.beanutils.Converter;


public class DateToStringConverter implements Converter {

	@SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    public Object convert(Class type, Object value) {
        if (value == null) {
            return null;
        } else if (value instanceof Date) {
            return CommonUtils.convertDateToString((Date) value);
        } else if (value instanceof Double) {
            return CommonUtils.formatNumber((Double) value);
        } else if (value instanceof Long) {
            return CommonUtils.formatNumber((Long) value);
        } else {
            return value.toString();
        }
    }
}
