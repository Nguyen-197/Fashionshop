package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.PaymentHistoryForm;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.PaymentHistory;



@Transactional
@Repository
public interface PaymentHistoryRepository extends CRUDDao<PaymentHistory, Long> {

    public List<PaymentHistory> findAll();

    public Page<PaymentHistory> findAll(Pageable pageable);

default String buildGetDataQuery(PaymentHistoryForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,amount As amount       ";
        nativeSQL += "       ,bank_code As bankCode     ";
        nativeSQL += "       ,bank_tran_no As bankTranNo   ";
        nativeSQL += "       ,card_type As cardType     ";
        nativeSQL += "       ,order_info As orderInfo    ";
        nativeSQL += "       ,pay_date As payDate      ";
        nativeSQL += "       ,response_code As responseCode ";
        nativeSQL += "       ,secure_hash As secureHash   ";
        nativeSQL += "       ,secure_hash_type As secureHashType ";
        nativeSQL += "       ,tmn_code As tmnCode      ";
        nativeSQL += "       ,transaction_no As transactionNo ";
        nativeSQL += "       ,txn_ref As txnRef       ";
        nativeSQL += "       ,user_id As userId       ";
        nativeSQL += "       FROM payment_history ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getAmount(), strCondition, paramList, "amount");
        CommonUtils.filter(form.getBankCode(), strCondition, paramList, "bank_code");
        CommonUtils.filter(form.getBankTranNo(), strCondition, paramList, "bank_tran_no");
        CommonUtils.filter(form.getCardType(), strCondition, paramList, "card_type");
        CommonUtils.filter(form.getOrderInfo(), strCondition, paramList, "order_info");
        CommonUtils.filter(form.getPayDate(), strCondition, paramList, "pay_date");
        CommonUtils.filter(form.getResponseCode(), strCondition, paramList, "response_code");
        CommonUtils.filter(form.getSecureHash(), strCondition, paramList, "secure_hash");
        CommonUtils.filter(form.getSecureHashType(), strCondition, paramList, "secure_hash_type");
        CommonUtils.filter(form.getTmnCode(), strCondition, paramList, "tmn_code");
        CommonUtils.filter(form.getTransactionNo(), strCondition, paramList, "transaction_no");
        CommonUtils.filter(form.getTxnRef(), strCondition, paramList, "txn_ref");
        CommonUtils.filter(form.getUserId(), strCondition, paramList, "user_id");
        return nativeSQL + strCondition.toString() + orderBy;
    }


    default DataTableResults<PaymentHistory> getDatatables(FilterData filterData, PaymentHistoryForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, PaymentHistory.class);
    }

    @Modifying
    @Query("delete from PaymentHistory u where u.id in ?1")
    void deleteByIds(List<Long> ids);
}
