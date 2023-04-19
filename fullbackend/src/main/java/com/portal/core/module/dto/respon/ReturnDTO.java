package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class ReturnDTO {
    private Long id;
    private String returnCode;      // Mã đơn đổi trả
    private Integer status;         // Trạng thái đơn đổi trả 1) Chờ xác nhận 2) Chưa nhận lại hàng 3) Đã nhận lại hàng
    private Integer statusRefund;   // Trạng thái hoàn tiền 1) Chưa hoàn tiền 2) Đã hoàn tiền
    private BigDecimal totalRefund; // Tổng tiền hoàn trả
    private String reason;   // Lý do trả
    private Integer isExchangeable;
    private String fullName;
    private String orderCode;
    private String createBy;   // Người tạo đơn
    private Date createDateReceive;   // Ngày nhận hàng
    private Date createDatePayment;   // Ngày thanh toán
    private Long idAddress;
    private List<DetailReturnDTO> listDetailReturn;

}
