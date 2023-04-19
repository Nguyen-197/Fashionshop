package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderDetailDTO {
    private Long id;
    private Long orderId;
    private BigDecimal totalPrice;
    private BigDecimal unitPrice;
    private Integer quantity;
    private Integer quantityBuy;
    private String code;
    private String productName;
    private String sizeName;
    private String colorName;
    private String image;
}
