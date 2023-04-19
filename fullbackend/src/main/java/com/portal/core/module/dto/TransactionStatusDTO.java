package com.portal.core.module.dto;

import lombok.Data;

@Data
public class TransactionStatusDTO {

    String status;
    String message;
    TransactionInfo data;
}
