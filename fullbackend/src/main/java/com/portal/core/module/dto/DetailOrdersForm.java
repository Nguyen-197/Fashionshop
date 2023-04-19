package com.portal.core.module.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;


@Data
public class DetailOrdersForm {

    private Long id;

    private BigDecimal totalPrice;

    @NotNull(message = "Trường đơn giá không thể để trống")
    private BigDecimal unitPrice;

    @NotNull(message = "Trường số lượng không thể để trống")
    private Integer quantity;

    private Long orderId;

    @NotNull(message = "Trường sản phẩm không thể để trống")
    private Long productDetailId;
}
