package com.portal.core.common.utils;

import com.portal.core.common.result.DataTableResults;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.NativeQuery;

import java.util.List;

@SuppressWarnings({"deprecation", "rawtypes"})
public interface FilterData {


    /**
     * Get session factory.
     *
     * @return
     */
    public SessionFactory getSessionFactory();

    /**
     * Get session.
     *
     * @return
     */
    public Session getSession();

    /**
     * Create native SQL
     */
    public SQLQuery createSQLQuery(String sql);

    /**
     * Create native SQL
     */
    public NativeQuery createNativeQuery(String sql);

    /**
     * list
     * @param nativeQuery
     * @param paramList
     * @param obj
     * @param <T>
     * @return
     */
    public <T> List<T> list(String nativeQuery, List<Object> paramList, Class obj);

    /**
     * ham set result transformer cua cau query
     *
     * @param query
     *            cau query
     * @param obj
     *            doi tuong
     */
    public void setResultTransformer(SQLQuery query, Class obj);

    /**
     * Get list alias column.
     *
     * @param query
     * @return
     */
    public List<String> getReturnAliasColumns(SQLQuery query);

    /**
     * phân trang
     * @param nativeQuery
     * @param orderBy
     * @param paramList
     * @param obj
     * @param <T>
     * @return
     */
    public <T> DataTableResults<T> findPaginationQuery(String nativeQuery, List<Object> paramList, Class obj);

    /**
     * phân trang
     * @param nativeQuery
     * @param orderBy
     * @param paramList
     * @param obj
     * @param <T>
     * @return
     */
    public <T> DataTableResults<T> findPaginationQuery(String nativeQuery, List<Object> paramList, Class obj, Integer limit);

    public <T> DataTableResults<T> findPaginationQuery(String nativeQuery, String strCondition,String groupBy, String orderBy, List<Object> paramList, Class obj);

    /**
     * Flush session.
     */
    public void flushSession();

    public <T> T get(String nativeQuery, List<Object> paramList, Class obj);
}
