package com.portal.core.module.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor


public class PaymentResDTO {

    String status;
    String message;
    String url;


}
