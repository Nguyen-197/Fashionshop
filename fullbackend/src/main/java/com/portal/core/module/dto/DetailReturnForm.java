package com.portal.core.module.dto;

import com.portal.core.module.entities.ProductDetail;
import lombok.Data;

import java.math.BigDecimal;


@Data
public class DetailReturnForm {

    private Long id;
    private BigDecimal price;
    private Integer quantity;
    private Long orderDetailId;
    private Long returnId;
}
