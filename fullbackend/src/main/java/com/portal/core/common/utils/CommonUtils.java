package com.portal.core.common.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.BeanUtil;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.commons.beanutils.ConvertUtilsBean;
import org.apache.commons.beanutils.PropertyUtilsBean;
import org.apache.commons.beanutils.converters.DoubleConverter;
import org.apache.commons.beanutils.converters.LongConverter;
import org.springframework.web.multipart.MultipartFile;

public class CommonUtils {

    /*
     * Hàm kiểm tra chuỗi null hoặc empty
     */
    public static boolean isNullOrEmpty(String str) {
        return (str == null || str.trim().isEmpty());
    }

    /*
     * Hàm kiểm tra list null hoặc empty
     */
    public static boolean isNullOrEmpty(List data) {
        return (data == null || data.isEmpty());
    }

    /*
     * Hàm chuyển string sang date
     */
    public static Date convertStringToDate(String date) throws Exception {
        if (isNullOrEmpty(date)) {
            return null;
        } else {
            String pattern = "yyyy-MM-dd";
            SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
            dateFormat.setLenient(false);
            return dateFormat.parse(date);
        }
    }

    /*
     * Hàm chuyển date sang string
     */
    public static String convertDateToString(Date date) {
        if(date == null) {
            return null;
        } else {
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            return dateFormat.format(date);
        }
    }

    /**
     * Format so.
     *
     * @param d So
     * @return Xau
     */
    public static String formatNumber(Double d) {
        if (d == null) {
            return "";
        } else {
            DecimalFormat format = new DecimalFormat("######.#####");
            return format.format(d);
        }
    }

    /**
     * Format so.
     *
     * @param d So
     * @return Xau
     */
    public static String formatNumber(Long d) {
        if (d == null) {
            return "";
        } else {
            DecimalFormat format = new DecimalFormat("######");
            return format.format(d);
        }
    }

    public static Integer NVL(Integer value) {
        return value == null ? new Integer(0) : value;
    }

    public static Long NVL(Long value, Long defaultValue) {
        return value == null ? defaultValue : value;
    }
    public static Long NVL(Long value) {
        return NVL(value, 0L);
    }

    public static String NVL(String value) {

        return NVL(value, "");
    }
    public static String NVL(String value, String defaultValue) {

        return NVL(value, defaultValue, value);
    }
    public static String NVL(String value, String nullValue, String notNullValue) {

        return value == null ? nullValue : notNullValue;
    }

    public static Integer NVL(Integer value, Integer defaultValue) {
        return value == null ? defaultValue : value;
    }

    public static BigDecimal NVL(BigDecimal value, BigDecimal defaultValue) {
        return value == null ? defaultValue : value;
    }

    /**
     * Checks if is collection empty.
     *
     * @param collection the collection
     * @return true, if is collection empty
     */
    private static boolean isCollectionEmpty(Collection<?> collection) {
        if (collection == null || collection.isEmpty()) {
            return true;
        }
        return false;
    }

    /**
    * Hàm kiểm tra object có empty
    *
     * @param object the object
     * @return true, if is object empty
     */
    public static boolean isEmpty(Object object) {
        if (object == null) {
            return true;
        } else if (object instanceof String) {
            if (((String) object).trim().length() == 0) {
                return true;
            }
        } else if (object instanceof Collection) {
            return isCollectionEmpty((Collection<?>) object );
        }
        return false;
    }

    public static <S> String getFieldNameID(S entity) {
        Field[] fields = entity.getClass().getDeclaredFields();
        for (Field field: fields) {
            Column columnField = field.getAnnotation(Column.class);
            if (columnField != null) {
                if (field.isAnnotationPresent(Id.class) && columnField != null) {
                    return field.getName();
                }
            }
        }
        return null;
    }

    public static <S extends Object> Object getPropertyValueByFieldName(S entity, String fieldName) {
        try {
            List<Field> fields = getAllField(entity.getClass());
            for (Field field: fields) {
                field.setAccessible(true);
                if (field.getName().toString().equals(fieldName)) {
                    return field.get(entity);
                }
            }
        } catch (Exception e) {

        }
        return null;
    }

    public static List<Field> getAllField(Class<?> type) {
        List<Field> fields = new ArrayList<>();
        getDeepFelds(fields, type);
        return fields;
    }

    private static List<Field> getDeepFelds(List<Field> fields, Class<?> type) {
        fields.addAll(Arrays.asList(type.getDeclaredFields()));
        if (type.getSuperclass() != null) {
            getDeepFelds(fields, type.getSuperclass());
        }
        return fields;
    }

    /**
     * Lấy danh sách field từ entity
     * @param entity
     */
    public static <S> List<String> getListFieldName(S entity) {
        Field [] fields = entity.getClass().getDeclaredFields();
        List<String> lstField = new ArrayList<>();
        for (Field field : fields) {
            Column columnField = field.getAnnotation(Column.class);
            if (columnField != null) {
                lstField.add(field.getName());
            }
            JoinColumn joinColumn = field.getAnnotation(JoinColumn.class);
            if (joinColumn != null) {
                lstField.add(field.getName());
            }
        }
        return lstField;
    }

    /*
    * Coppy tu form sang bo
     */
    public static void copyProperties(Object dest, Object orig, List<String> listField) throws Exception {
        BeanUtilsBean beanUtilsBean = getUtilsBean();
        listField.forEach(fieldName -> {
            Object value = CommonUtils.getPropertyValueByFieldName(orig, fieldName);
            try {
                beanUtilsBean.copyProperty(dest, fieldName, value);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    /**
     * @return
     */
    public static BeanUtilsBean getUtilsBean() {
        ConvertUtilsBean convertUtilsBean = new ConvertUtilsBean();
        convertUtilsBean.register(new LongConverter(), Long.class);
        convertUtilsBean.register(new DoubleConverter(), Double.class);
        convertUtilsBean.register(new StringToDateConverter(), Date.class);
        convertUtilsBean.register(new DateToStringConverter(), String.class);
        BeanUtilsBean beanUtilsBean = new BeanUtilsBean(convertUtilsBean, new PropertyUtilsBean());
        return beanUtilsBean;
    }

    /**
     * Build query Long
     * @param n
     * @param queryString
     * @param paramList
     * @param field
     */
    public static void filter(Long n, StringBuilder queryString, List<Object> paramList, String field) {
        if((n != null) && n > 0L) {
            queryString.append(" AND ").append(field).append(" = ? ");
            paramList.add(n);
        }
    }

    public static void filter(List<Long> listId, StringBuilder strCondition, List<Object> paramList, String field) {
        boolean first = true;
        if (!CommonUtils.isNullOrEmpty(listId)) {
            strCondition.append(" AND ( ");
            for (Long id : listId) {
                if (!first) {
                    strCondition.append(" OR ");
                } else {
                    first = false;
                }
                strCondition.append(" CONCAT(','," + field + ",',') LIKE ? ");
                paramList.add("%," + id.toString() + ",%");
            }

            strCondition.append(" ) ");
        }
    }

    public static void filterStr(List<String> listId, StringBuilder strCondition, List<Object> paramList, String field) {
        boolean first = true;
        if (!CommonUtils.isNullOrEmpty(listId)) {
            strCondition.append(" AND ( ");
            for (String id : listId) {
                if (!first) {
                    strCondition.append(" OR ");
                } else {
                    first = false;
                }
                strCondition.append(" CONCAT(','," + field + ",',') LIKE ? ");
                paramList.add("%," + id.toString() + ",%");
            }

            strCondition.append(" ) ");
        }
    }

    /**
     * Build query date
     * @param date
     * @param queryString
     * @param paramList
     * @param field
     */
    public static void filter(Date date, StringBuilder queryString, List<Object> paramList, String field) {
        if(date != null) {
            queryString.append(" AND ").append(field).append(" = ? ");
            paramList.add(date);
        }
    }

    /**
     * Build query Boolean
     * @param n
     * @param queryString
     * @param paramList
     * @param field
     */
    public static void filter(Boolean n, StringBuilder queryString, List<Object> paramList, String field) {
        if (n != null) {
            queryString.append(" AND ").append(field).append(" = ? ");
            paramList.add(n);
        }
    }

    /**
     * Build query String
     * @param str
     * @param queryString
     * @param paramList
     * @param field
     */
    public static void filter(String str, StringBuilder queryString, List<Object> paramList, String field) {
        if((str != null) && !"".equals(str.trim())) {
            queryString.append(" AND LOWER(").append(field).append(") LIKE ? ESCAPE '/'");
            str = str.replace("  ", " ");
            str = "%" + str.trim().toLowerCase().replace("/", "//").replace("_", "/_").replace("%", "/%") + "%";
            paramList.add(str);
        }
    }

    /**
     * Build query value Integer
     * @param n
     * @param queryString
     * @param paramList
     * @param field
     */
    public static void filter(Integer n, StringBuilder queryString, List<Object> paramList, String field) {
        if ((n != null) && (n > 0)) {
            queryString.append(" AND ").append(field).append(" = ? ");
            paramList.add(n);
        }
    }

    /**
     * Build query value BigDecimal
     * @param n
     * @param queryString
     * @param paramList
     * @param field
     */
    public static void filter(BigDecimal n, StringBuilder queryString, List<Object> paramList, String field) {
        if ((n != null) && (n.compareTo(BigDecimal.ZERO) > 0)) {
            queryString.append(" AND ").append(field).append(" = ? ");
            paramList.add(n);
        }
    }
    /**
     * buildPaginateQuery
     * @param baseQuery
     * @param searchParam
     * @return
     */
    public static String buildPaginateQuery(String baseQuery, SearchParam searchParam) {
        String orderBy = "";
        String baseQueryTemp = baseQuery;
        if (!isEmpty(searchParam)) {
            if (!"".equals(CommonUtils.NVL(searchParam.getOrderByClause()))) {
                orderBy = searchParam.getOrderByClause();
                if (baseQueryTemp.toLowerCase().lastIndexOf(" order by ") > -1) {
                    baseQueryTemp = baseQueryTemp.substring(0, baseQueryTemp.toLowerCase().lastIndexOf(" order by "));
                }
            }
        }
        StringBuilder sb = new StringBuilder("#BASE_QUERY# #ORDER_CLASUE# ");
        String finalQuery = sb.toString().replaceAll("#BASE_QUERY#", baseQueryTemp).replaceAll("#ORDER_CLASUE#", CommonUtils.NVL(orderBy));
        return finalQuery;
    }

    /**
     * buildCountQuery
     * @param baseQuery
     * @return
     */
    public static String buildCountQuery(String baseQuery) {
        String newBaseQuery = "";
        int indexFrom = baseQuery.toLowerCase().lastIndexOf(" from ");
        newBaseQuery = "SELECT 1 " + baseQuery.substring(indexFrom, baseQuery.length());
        StringBuilder sb = new StringBuilder("SELECT COUNT(*) FROM (#BASE_QUERY#) FILTERED_ORDERD_RESULTS ");
        String finalQuery = null;
        finalQuery = sb.toString().replaceAll("#BASE_QUERY#", newBaseQuery);
        return (null == finalQuery) ? baseQuery : finalQuery;
    }

    public static String convertObjectToJson(Object object) throws JsonProcessingException {
        if (object == null) {
            return null;
        }
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(object);
    }

    /**
     * Lưu file vào local
     */
    public static String storeFile(String filePath, MultipartFile multipartFile) throws IllegalStateException, IOException {
        multipartFile.transferTo(new File(filePath));
        return filePath;
    }
}
