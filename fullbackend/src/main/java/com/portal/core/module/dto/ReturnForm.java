package com.portal.core.module.dto;

import java.math.BigDecimal;
import java.util.List;

import com.portal.core.module.entities.Orders;
import lombok.Data;

import javax.persistence.Column;


@Data
public class ReturnForm {

    private Long id;
    private String returnCode;
    private Integer status;             // Trạng thái đơn đổi trả 1) Chờ xác nhận 2) Chưa nhận lại hàng 3) Đã nhận lại hàng
    private Integer statusRefund;       // Trạng thái hoàn tiền 1) Chưa hoàn tiền 2) Đã hoàn tiền
    private BigDecimal totalRefund;     // Tổng tiền hoàn trả
    private String reason;              // Lý do trả
    private Long ordersId;
    List<DetailReturnForm> detailReturnFormList;
    private String fullName;
    private String phoneNumber;
    private String orderCode;
    private Integer isExchangeable;

}
