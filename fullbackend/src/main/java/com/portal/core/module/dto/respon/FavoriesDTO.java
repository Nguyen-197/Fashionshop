package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;
@Data
public class FavoriesDTO {
    private Long id;
    private Long idProduct;
    private String productName;
    private String categoryName;
    private String image;
    private String description;
    private Integer quantity;
    private BigDecimal minPrice; // Min giá bán
    private BigDecimal maxPrice; // Max giá bán
    private BigDecimal minSalePrice; // Min giá sale
    private BigDecimal maxSalePrice; // Max giá sale
}
