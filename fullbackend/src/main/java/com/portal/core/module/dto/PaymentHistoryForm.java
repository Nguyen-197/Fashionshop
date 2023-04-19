package com.portal.core.module.dto;

import lombok.Data;

@Data
public class PaymentHistoryForm {

    private Long id;
    private String amount;
    private String bankCode;
    private String bankTranNo;
    private String cardType;
    private String orderInfo;
    private String payDate;
    private String responseCode;
    private String secureHash;
    private String secureHashType;
    private String tmnCode;
    private String transactionNo;
    private String txnRef;
    private String userId;
}
