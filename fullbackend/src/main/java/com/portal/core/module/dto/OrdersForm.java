package com.portal.core.module.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.portal.core.module.entities.DetailOrders;
import lombok.Data;

@Data
public class OrdersForm {

    private Long id;
    private String orderCode;
    private String codeLading;  // Mã vận đơn
    private String addressDetail;
    private String addressName;
    private Date createDate;
    private BigDecimal deliveryCost;
    private String fullName;
    private String phoneNumber;
    private Integer status;
    List<DetailOrdersForm> detailOrdersList;
    private Long userId;
    private Long idAddress;
    private BigDecimal totalPrice;
    private Integer paymentType; // Phương thức thanh toán 1) thanh toán online - 2) Thanh toán khi nhận hàng;
    private Integer paymentStatus; // Trạng thái thanh toán 0) Chưa thanh toán - 1) Đã thanh toán
    private Integer deliveryType; // Phương thức giao hàng 1) Nhận tại cửa hàng - 2) Giao qua hãng vận chuyển;
    private Date estimatedDeliveryTime; // Thời gian giao hàng dự kiến
    private Date createDateComplete;
}