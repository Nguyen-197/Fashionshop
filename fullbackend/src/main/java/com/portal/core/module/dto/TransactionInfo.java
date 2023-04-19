package com.portal.core.module.dto;

import lombok.*;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionInfo {

    String txnRef;
    String bankCode;
    Date payDate;
    String amout;
    String cardType;
    String description;

}
