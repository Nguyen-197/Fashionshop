package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.ReturnForm;
import com.portal.core.module.dto.respon.ReturnDTO;
import com.portal.core.module.entities.Return;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Transactional
@Repository
public interface ReturnRepository extends CRUDDao<Return, Long> {
    public List<Return> findAll();

    public Page<Return> findAll(Pageable pageable);

    default String buildGetDataQuery(ReturnForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,address_detail As addressDetail ";
        nativeSQL += "       ,address_name As addressName  ";
        nativeSQL += "       ,full_name As fullName     ";
        nativeSQL += "       ,phone_number As phoneNumber  ";
        nativeSQL += "       ,status As status       ";
        nativeSQL += "       ,status_refund As statusRefund ";
        nativeSQL += "       ,total_refund As totalRefund  ";
        nativeSQL += "       FROM return ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
//        CommonUtils.filter(form.getStatus(), strCondition, paramList, "status");
//        CommonUtils.filter(form.getStatusRefund(), strCondition, paramList, "status_refund");
//        CommonUtils.filter(form.getTotalRefund(), strCondition, paramList, "total_refund");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    default DataTableResults<Return> getDatatables(FilterData filterData, ReturnForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Return.class);
    }

    @Modifying
    @Query("delete from Return u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    @Modifying
    @Query("UPDATE Return SET status = :status WHERE id = :idReturn")
    void updateStatusReturnOrder(@Param("status") Integer status, @Param("idReturn") Long idReturn);

    @Modifying
    @Query("UPDATE Return SET statusRefund = 2 WHERE  id = :idReturn AND statusRefund = 1")
    void updateStatusRefund(@Param("idReturn") Long idReturn);

    default DataTableResults<ReturnDTO> searchReturnOrder(FilterData filterData, ReturnForm form) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        r.id as id,           ";
        nativeSQL += "        r.return_code as returnCode, ";
        nativeSQL += "        r.`status` as status,  ";
        nativeSQL += "        r.status_refund as statusRefund,     ";
        nativeSQL += "        r.total_refund as totalRefund, ";
        nativeSQL += "        r.reason as reason,      ";
        nativeSQL += "        r.create_by as createBy,      ";
        nativeSQL += "        r.create_date_receive as createDateReceive,      ";
        nativeSQL += "        r.create_date_payment as createDatePayment,      ";
        nativeSQL += "        o.order_code as orderCode, ";
        nativeSQL += "        a.full_name as fullName  ";
        nativeSQL += "       FROM `returns` r ";
        nativeSQL += "       JOIN orders o ON r.id_orders = o.id ";
        nativeSQL += "       JOIN address a on a.id = o.id_address ";
        String orderBy = " ORDER BY r.id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "r.id");
        CommonUtils.filter(form.getReturnCode(), strCondition, paramList, "r.return_code");
        CommonUtils.filter(form.getStatus(), strCondition, paramList, "r.`status`");
        CommonUtils.filter(form.getTotalRefund(), strCondition, paramList, "r.total_refund");
        CommonUtils.filter(form.getFullName(), strCondition, paramList, "a.full_name");
        CommonUtils.filter(form.getPhoneNumber(), strCondition, paramList, "a.phone_number");
        CommonUtils.filter(form.getFullName(), strCondition, paramList, "r.reason");
        CommonUtils.filter(form.getOrderCode(), strCondition, paramList, "o.order_code");
        return filterData.findPaginationQuery(nativeSQL + strCondition + orderBy , paramList, ReturnDTO.class);
    }

    default ReturnDTO getDetailReturn(FilterData filterData, Long idReturn) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        r.id as id,          ";
        nativeSQL += "        r.return_code as returnCode, ";
        nativeSQL += "        o.id_address as idAddress,  ";
        nativeSQL += "        o.order_code as orderCode,     ";
        nativeSQL += "        r.return_code as returnCode, ";
        nativeSQL += "        r.`status` as status,      ";
        nativeSQL += "        r.status_refund as statusRefund,      ";
        nativeSQL += "        r.total_refund as totalRefund,      ";
        nativeSQL += "        r.create_by as createBy,      ";
        nativeSQL += "        r.create_date_payment as createDatePayment, ";
        nativeSQL += "        r.create_date_receive as createDateReceive,  ";
        nativeSQL += "        r.reason as reason  ";
        nativeSQL += "       FROM  `returns` r ";
        nativeSQL += "       JOIN `orders` o on o.id = r.id_orders ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1");
        strCondition.append(" AND r.id = ? ");
        paramList.add(idReturn);
        return filterData.get(nativeSQL + strCondition, paramList, ReturnDTO.class);
    }
}
