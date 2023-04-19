package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DetailReturnDTO {
    private Long id;
    private BigDecimal price;
    private Integer quantity;
    private Long orderDetailId;
    private Long returnId;
    private String productCode;
    private String productName;
    private String sizeName;
    private String colorName;
    private String image;
}
