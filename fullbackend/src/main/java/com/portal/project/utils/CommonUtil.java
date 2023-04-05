package com.portal.project.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class CommonUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(CommonUtil.class);

    public static String convertObjectToJson(Object object) throws JsonProcessingException {
        if (object == null) {
            return null;
        }
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(object);
    }

    /**
     * Chuyen doi tuong Date thanh doi tuong String.
     *
     * @param date
     *            Doi tuong Date
     * @return Xau ngay, co dang dd/MM/yyyy
     */
    public static String convertDateToString(Date date, String pattern) {
        if (date == null) {
            return "";
        } else {
            SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
            return dateFormat.format(date);
        }
    }

    /**
     * Conver tu string sang date theo dinh dang mong muon
     *
     * @param date
     * @param pattern
     *            : kieu dinh dang vd: "dd/MM/yyyy hh:MM"
     * @return
     * @throws Exception
     */
    public static Date convertStringToDateTime(String date, String pattern) throws Exception {
        if (date == null || date.trim().isEmpty()) {
            return null;
        } else {
            SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
            dateFormat.setLenient(false);
            try {
                return dateFormat.parse(date);
            } catch (Exception ex) {
                LOGGER.error("convertStringToDateTime", ex);
                return null;
            }
        }
    }

    /**
     * Check string is null.
     *
     * @param str
     * @return
     */
    public static boolean isNullOrEmpty(String str) {
        return (str == null || str.trim().isEmpty());
    }

    /**
     * Check list object is null.
     *
     * @param data
     * @return
     */
    public static boolean isNullOrEmpty(List data) {
        return (data == null || data.isEmpty());
    }

    public static Object NVL(Object value, Object defaultValue) {
        return value == null ? defaultValue : value;
    }

    public static Double NVL(Double value) {
        return NVL(value, new Double(0));
    }

    public static Integer NVL(Integer value) {
        return value == null ? new Integer(0) : value;
    }

    public static Integer NVL(Integer value, Integer defaultValue) {
        return value == null ? defaultValue : value;
    }

    public static BigDecimal NVL(BigDecimal value) {
        return value == null ? new BigDecimal(0) : value;
    }

    public static Double NVL(Double value, Double defaultValue) {
        return value == null ? defaultValue : value;
    }

    public static Long NVL(Long value, Long defaultValue) {
        return value == null ? defaultValue : value;
    }

    public static String NVL(String value, String nullValue, String notNullValue) {
        return value == null ? nullValue : notNullValue;
    }

    public static String NVL(String value, String defaultValue) {
        return NVL(value, defaultValue, value);
    }

    public static String NVL(String value) {
        return NVL(value, "");
    }

    public static Long NVL(Long value) {
        return NVL(value, 0L);
    }

    /**
     * Builds the paginated query.
     *
     * @param baseQuery          the base query
     * @return the string
     */
    public static String buildCountQuery(String baseQuery) {
        StringBuilder sb = new StringBuilder("SELECT COUNT(*) FROM (#BASE_QUERY#) FILTERED_ORDERD_RESULTS ");
        String finalQuery = null;
        finalQuery = sb.toString().replaceAll("#BASE_QUERY#", baseQuery);
        return (null == finalQuery) ? baseQuery : finalQuery;
    }

    /**
     * getUserLoginName
     * @param req
     * @return
     */
    public static Object getUserLoginName(HttpServletRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getPrincipal().toString();
    }

    /**
     * getUserLoginName
     * @return
     */
    public static String getUserLoginName() {
        // TODO Auto-generated method stub
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getPrincipal().toString();
    }
}
