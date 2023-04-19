package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String code;
    private String image;
    private Integer quantity;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<ProductDetailDTO> listProductDetails;
    private String categoryName;
    private Long idCategory;
    private BigDecimal minSalePrice; //Min giá sale
    private BigDecimal maxSalePrice; //Max giá sale
    private Integer sellNumber; //Số lượng đã bán
    private String description;
}
