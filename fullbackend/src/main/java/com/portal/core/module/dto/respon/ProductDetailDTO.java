package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDetailDTO {
    private Long id;
    private Long idProduct;
    private BigDecimal salePrice;
    private BigDecimal finalPrice;
    private String productName;
    private String sizeName;
    private String colorName;
    private String image;
    private Integer quantity;
    private String categoryName;
    private Integer mass; // Khối lượng
}
