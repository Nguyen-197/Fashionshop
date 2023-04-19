package com.portal.core.module.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.PaymentHistory;
import com.portal.core.module.dto.PaymentHistoryForm;
import com.portal.core.module.repository.PaymentHistoryRepository;


@Service
public class PaymentHistoryService extends CRUDService<PaymentHistory, PaymentHistoryForm> {

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;

    @Override
    public CRUDDao<PaymentHistory, Long> getBaseDao() {
        return paymentHistoryRepository;
    }


    @Override
    public DataTableResults<PaymentHistory> getDataTables(PaymentHistoryForm form) {
        return paymentHistoryRepository.getDatatables(filterData, form);
    }
}
