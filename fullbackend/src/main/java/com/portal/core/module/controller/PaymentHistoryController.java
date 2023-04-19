package com.portal.core.module.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.PaymentHistory;
import com.portal.core.module.dto.PaymentHistoryForm;
import com.portal.core.module.service.PaymentHistoryService;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/v1/payment-history")
public class PaymentHistoryController extends CRUDController<PaymentHistory, PaymentHistoryForm> {

    @Autowired
    private PaymentHistoryService paymentHistoryService;

    @Override
    protected CRUDService<PaymentHistory, PaymentHistoryForm> getMainService() {
        return paymentHistoryService;
    }

    @Override
    protected Class<PaymentHistory> getClassEntity() {
        return PaymentHistory.class;
    }
}
