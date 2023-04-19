package com.portal.core.module.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "payment_history")
public class PaymentHistory {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount")
    private String amount;

    @Column(name = "bank_code")
    private String bankCode;

    @Column(name = "bank_tran_no")
    private String bankTranNo;

    @Column(name = "card_type")
    private String cardType;

    @Column(name = "order_info")
    private String orderInfo;

    @Column(name = "pay_date")
    private String payDate;

    @Column(name = "response_code")
    private String responseCode;

    @Column(name = "secure_hash")
    private String secureHash;

    @Column(name = "secure_hash_type")
    private String secureHashType;

    @Column(name = "tmn_code")
    private String tmnCode;

    @Column(name = "transaction_no")
    private String transactionNo;

    @Column(name = "txn_ref")
    private String txnRef;

    @Column(name = "user_id")
    private String userId;

}
