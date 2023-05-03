package com.portal.core.module.repository;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.UserForm;
import com.portal.core.module.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Transactional
@Repository
public interface UserRepository  extends CRUDDao<User,Long> {

    Optional<User> findById(Long id);

    Optional<User> findByEmailAndActive(String email, boolean active);


    User findByPhoneNumberAndActive(String email, boolean active);

    Optional<User> findByEmailOrPhoneNumber(String email,String phoneNumber);

    @Query("SELECT e from User e where LOWER(e.email) = lower(:email) ")
    List<User> findConfilictByEmail(@Param("email") String email);

    @Query("SELECT e from User e where e.id <> :id and lower(e.email) = lower(:email) ")
    List<User> findConfilictByEmail(@Param("id") Long id, @Param("email") String email);

    @Query("SELECT e from User e where LOWER(e.phoneNumber) = lower(:phoneNumber) ")
    List<User> findConfilictByPhoneNumber(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT e from User e where e.id <> :id and lower(e.phoneNumber) = lower(:phoneNumber) ")
    List<User> findConfilictByPhoneNumber(@Param("id") Long id, @Param("phoneNumber") String phoneNumber);

    @Modifying
    @Query("UPDATE User a SET a.active = case " +
            "                            when a.active = true then false " +
            "                            else true " +
            "                            end " +
            "WHERE a.id = ?1" +
            "")
    void deleteUser(Long id);

    @Query("select a from User a where (:id is null or lower(a.id) = :id) and (:phoneNumber is null or lower(a.phoneNumber) like %:phoneNumber%) and (:fullName is null or lower(a.fullName) like %:fullName%) and (:email is null or lower(a.email) like %:email%)")
    Page<User> getUser(@Param("id") Long id,
                       @Param("phoneNumber") String phoneNumber,
                       @Param("fullName") String fullName,
                       @Param("email") String email,
                       Pageable pageable
                        );
    default String buildGetDataQuery(UserForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        u.id as id           ";
        nativeSQL += "       ,u.active as active       ";
        nativeSQL += "       ,u.email as email    ";
        nativeSQL += "       ,u.full_name as fullName       ";
        nativeSQL += "       ,u.phone_number as phoneNumber    ";
        nativeSQL += "       ,ur.id as roleId    ";
        nativeSQL += "       ,ur.name as roleName   ";
        nativeSQL += "       ,(SELECT SUM(or_done.total_price) FROM orders or_done WHERE u.id = or_done.id_user AND or_done.status = 5 ) as totalPriceDone   ";
        nativeSQL += "       ,(SELECT COUNT(or_done.id_user) FROM orders or_done WHERE u.id = or_done.id_user AND or_done.status = 5 ) as totalOrderDone   ";
        nativeSQL += "       FROM u_user u ";
        nativeSQL += "        INNER JOIN u_role ur on ur.id = u.role_id ";
        String orderBy = " ORDER BY u.id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getActive(), strCondition, paramList, "active");
        CommonUtils.filter(form.getEmail(), strCondition, paramList, "email");
        CommonUtils.filter(form.getFullName(), strCondition, paramList, "full_name");
        CommonUtils.filter(form.getPhoneNumber(), strCondition, paramList, "phone_number");
        CommonUtils.filter(form.getRoles(), strCondition, paramList, "role_id");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param form
     * @return
     */
    default DataTableResults<User> getDatatables(FilterData filterData, UserForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, User.class);
    }

    default String buildQueryGetUserCustomer(UserForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        u.id as id           ";
        nativeSQL += "       ,u.active as active       ";
        nativeSQL += "       ,u.email as email    ";
        nativeSQL += "       ,u.full_name as fullName       ";
        nativeSQL += "       ,u.phone_number as phoneNumber    ";
        nativeSQL += "       ,ur.id as roleId    ";
        nativeSQL += "       ,ur.name as roleName   ";
        nativeSQL += "       FROM u_user u ";
        nativeSQL += "        join u_role ur on ur.id = u.role_id ";
        String orderBy = " ORDER BY u.id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND u.role_id = 3");
        strCondition.append(" AND u.active = 1");
        CommonUtils.filter(form.getEmail(), strCondition, paramList, "email");
        CommonUtils.filter(form.getFullName(), strCondition, paramList, "full_name");
        CommonUtils.filter(form.getPhoneNumber(), strCondition, paramList, "phone_number");
        CommonUtils.filter(form.getRoles(), strCondition, paramList, "role_id");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param form
     * @return
     */
    default List<User> getAllCustomer(FilterData filterData, UserForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildQueryGetUserCustomer(form, paramList);
        return filterData.list(nativeQuery, paramList, User.class);
    }
}
