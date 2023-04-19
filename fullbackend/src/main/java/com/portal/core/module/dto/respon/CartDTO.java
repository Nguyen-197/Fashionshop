package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartDTO {
    private Long id;
    private Integer quantity;
    private BigDecimal salePrice;
    private BigDecimal finalPrice;
    private String image;
    private String sizeName;
    private String colorName;
    private String productName;
    private Long idProduct;
    private Long idProductDetail;
    private Integer mass;
}
