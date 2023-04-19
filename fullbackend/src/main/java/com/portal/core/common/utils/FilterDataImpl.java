package com.portal.core.common.utils;

import com.google.gson.Gson;
import com.portal.core.common.result.DataTableResults;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class FilterDataImpl implements FilterData {

    private static final Logger LOGGER = LoggerFactory.getLogger(FilterDataImpl.class);

    @Autowired
    private EntityManager entityManager;

    @Override
    public SessionFactory getSessionFactory() {
        return entityManager.getEntityManagerFactory().unwrap(SessionFactory.class);
    }

    @Override
    public Session getSession() {
        return entityManager.unwrap(Session.class);
    }

    @Autowired
    private HttpServletRequest req;

    @Override
    public SQLQuery createSQLQuery(String sql) {
        return getSession().createSQLQuery(sql);
    }

    @Override
    public NativeQuery createNativeQuery(String sql) {
        return getSession().createNativeQuery(sql);
    }

    @Override
    public <T> List<T> list(String nativeQuery, List<Object> paramList, Class obj) {
        NativeQuery query =  createNativeQuery(nativeQuery);
        try {
            setResultTransformer(query, obj);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(!CommonUtils.isNullOrEmpty(paramList)) {
            int paramSize = paramList.size();
            for (int i = 0; i < paramSize; i++ ) {
                query.setParameter(i + 1, paramList.get(i));
            }
        }
        query.setMaxResults(Integer.MAX_VALUE);
        return query.list();
    }

    @Override
    public void setResultTransformer(SQLQuery query, Class obj) {
        Field[] fields = obj.getDeclaredFields();
        Map<String, String> mapFields = new HashMap<>();
        for (Field field: fields) {
            mapFields.put(field.getName(), field.getGenericType().toString());
        }
        List<String> aliasColumns = getReturnAliasColumns(query);
        for (String aliasColumn : aliasColumns) {
            String dataType = mapFields.get(aliasColumn);
            if (dataType == null) {
                LOGGER.debug(aliasColumn + " is not defined");
            } else {
                Type hbmType = null;
                if ("class java.lang.Long".equals(dataType)) {
                    hbmType = LongType.INSTANCE;
                } else if ("class java.lang.Integer".equals(dataType)) {
                    hbmType = IntegerType.INSTANCE;
                } else if ("class java.lang.Double".equals(dataType)) {
                    hbmType = DoubleType.INSTANCE;
                } else if ("class java.lang.String".equals(dataType)) {
                    hbmType = StringType.INSTANCE;
                } else if ("class java.lang.Boolean".equals(dataType)) {
                    hbmType = BooleanType.INSTANCE;
                } else if ("class java.util.Date".equals(dataType)) {
                    hbmType = TimestampType.INSTANCE;
                } else if ("class java.math.BigDecimal".equals(dataType)) {
                    hbmType = BigDecimalType.INSTANCE;
                }
                if (hbmType == null) {
                    LOGGER.debug(dataType + " is not supported");
                } else {
                    query.addScalar(aliasColumn, hbmType);
                }
            }
        }
        query.setResultTransformer(Transformers.aliasToBean(obj));
    }

    @Override
    public List<String> getReturnAliasColumns(SQLQuery query) {
        List<String> aliasColumns = new ArrayList();
        String sqlQuery = query.getQueryString();
        sqlQuery = sqlQuery.replace("\n", " ");
        sqlQuery = sqlQuery.replace("\t", " ");
        int numOfRightPythis = 0;
        int startPythis = -1;
        int endPythis = 0;
        boolean hasRightPythis = true;
        while (hasRightPythis) {
            char[] arrStr = sqlQuery.toCharArray();
            hasRightPythis = false;
            int idx = 0;
            for (char c : arrStr) {
                if (idx > startPythis) {
                    if ("(".equalsIgnoreCase(String.valueOf(c))) {
                        if (numOfRightPythis == 0) {
                            startPythis = idx;
                        }
                        numOfRightPythis++;
                    } else if (")".equalsIgnoreCase(String.valueOf(c))) {
                        if (numOfRightPythis > 0) {
                            numOfRightPythis--;
                            if (numOfRightPythis == 0) {
                                endPythis = idx;
                                break;
                            }
                        }
                    }
                }
                idx++;
            }
            if (endPythis > 0) {
                sqlQuery = sqlQuery.substring(0, startPythis) + " # " + sqlQuery.substring(endPythis + 1);
                hasRightPythis = true;
                endPythis = 0;
            }
        }
        String arrStr[] = sqlQuery.substring(0, sqlQuery.toUpperCase().indexOf(" FROM ")).split(",");
        for (String str : arrStr) {
            String[] temp = str.trim().split(" ");
            String alias = temp[temp.length - 1].trim();
            if (alias.contains(".")) {
                alias = alias.substring(alias.lastIndexOf(".") + 1).trim();
            }
            if (alias.contains(",")) {
                alias = alias.substring(alias.lastIndexOf(",") + 1).trim();
            }
            if (alias.contains("`")) {
                alias = alias.replace("`", "");
            }
            if (!aliasColumns.contains(alias)) {
                aliasColumns.add(alias);
            }
        }
        return aliasColumns;
    }

    @Override
    public <T> DataTableResults<T> findPaginationQuery(String nativeQuery, List<Object> paramList, Class obj) {
        return findPagination(nativeQuery, paramList, obj, 10);
    }

    @Override
    public <T> DataTableResults<T> findPaginationQuery(String nativeQuery, List<Object> paramList, Class obj, Integer limit) {
        return findPagination(nativeQuery, paramList, obj, limit);
    }

    @Override
    public <T> DataTableResults<T> findPaginationQuery(String nativeQuery, String strCondition,String groupBy, String orderBy, List<Object> paramList, Class obj) {
        return findPagination(nativeQuery,strCondition, groupBy, orderBy, paramList, obj, 10);
    }

    @Override
    public void flushSession() {
        getSession().flush();
    }

    @Override
    public <T> T get(String nativeQuery, List<Object> paramList, Class obj) {
        NativeQuery query = createNativeQuery(nativeQuery);
        setResultTransformer(query, obj);
        if (!CommonUtils.isNullOrEmpty(paramList)) {
            int paramSize = paramList.size();
            for (int i = 0; i < paramSize; i++) {
                query.setParameter(i+1, paramList.get(i));
            }
        }
        query.setMaxResults(1);
        return (T) query.uniqueResult();
    }

    private <T> DataTableResults<T> findPagination(String nativeQuery, List<Object> paramList, Class obj, int limit) {
        String _search = req.getParameter("_search");
        SearchParam searchParam = new SearchParam();
        if (!CommonUtils.isNullOrEmpty(_search)) {
            searchParam = new Gson().fromJson(_search, SearchParam.class);
        }
        String paginateQuery = CommonUtils.buildPaginateQuery(nativeQuery, searchParam);
        String countStrQuery = CommonUtils.buildCountQuery(nativeQuery);

        SQLQuery query = createSQLQuery(paginateQuery);
        setResultTransformer(query, obj);

        // pagination
        query.setFirstResult(CommonUtils.NVL(searchParam.getFirst()));
        query.setMaxResults(CommonUtils.NVL(searchParam.getRows(), limit));

        SQLQuery countQuery = createSQLQuery(countStrQuery);

        if (!CommonUtils.isNullOrEmpty(paramList)) {
            int paramSize = paramList.size();
            for (int i = 0; i < paramSize; i++) {
                countQuery.setParameter(i+1, paramList.get(i));
                query.setParameter(i+1, paramList.get(i));
            }
        }
        List<T> userList = query.list();
        Object totalRecords = countQuery.uniqueResult();
        DataTableResults<T> dataTableResults = new DataTableResults<>();
        dataTableResults.setData(userList);
        if (!CommonUtils.isEmpty(userList)) {
            Integer total = totalRecords != null ? Integer.valueOf(totalRecords.toString()) : 0;
            dataTableResults.setRecordFiltered(total);
            dataTableResults.setRecordTotal(total);
            dataTableResults.setFirst(Integer.valueOf(CommonUtils.NVL(searchParam.getFirst())));
        } else {
            dataTableResults.setRecordTotal(0);
            dataTableResults.setRecordFiltered(0);
        }
        return dataTableResults;
    }

    private <T> DataTableResults<T> findPagination(String nativeQuery,String strCondition,String groupBy, String orderBy, List<Object> paramList, Class obj, int limit) {
        String _search = req.getParameter("_search");
        SearchParam searchParam = new SearchParam();
        if (!CommonUtils.isNullOrEmpty(_search)) {
            searchParam = new Gson().fromJson(_search, SearchParam.class);
        }
        String paginateQuery = CommonUtils.buildPaginateQuery(nativeQuery + strCondition + groupBy + orderBy, searchParam);
        String countStrQuery = CommonUtils.buildCountQuery(nativeQuery + groupBy + orderBy);

        SQLQuery query = createSQLQuery(paginateQuery);
        setResultTransformer(query, obj);

        // pagination
        query.setFirstResult(CommonUtils.NVL(searchParam.getFirst()));
        query.setMaxResults(CommonUtils.NVL(searchParam.getRows(), limit));

        SQLQuery countQuery = createSQLQuery(countStrQuery);

        if (!CommonUtils.isNullOrEmpty(paramList)) {
            int paramSize = paramList.size();
            for (int i = 0; i < paramSize; i++) {
                countQuery.setParameter(i+1, paramList.get(i));
                query.setParameter(i+1, paramList.get(i));
            }
        }
        List<T> userList = query.list();
        Object totalRecords = countQuery.uniqueResult();
        DataTableResults<T> dataTableResults = new DataTableResults<>();
        dataTableResults.setData(userList);
        if (!CommonUtils.isEmpty(userList)) {
            Integer total = totalRecords != null ? Integer.valueOf(totalRecords.toString()) : 0;
            dataTableResults.setRecordFiltered(total);
            dataTableResults.setRecordTotal(total);
            dataTableResults.setFirst(Integer.valueOf(CommonUtils.NVL(searchParam.getFirst())));
        } else {
            dataTableResults.setRecordTotal(0);
            dataTableResults.setRecordFiltered(0);
        }
        return dataTableResults;
    }
}
