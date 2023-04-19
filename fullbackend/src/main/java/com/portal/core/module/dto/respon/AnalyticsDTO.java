package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AnalyticsDTO {
    private Integer countStatus;        // Tổng số đơn hàng theo trạng thái
    private BigDecimal totalPriceReturn;// Tổng tiền trả hàng
    private Integer totalReturn;        // Tổng số đơn trả hàng
    private Integer totalOrder;         // Tổng số đơn hàng
    private BigDecimal totalPrice;      // Tổng số tiền đã thanh toán
}
