package com.portal.core.module.dto.respon;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private String orderCode;
    private String codeLading;     // Mã vận đơn
    private BigDecimal totalPrice; // Tổng tiền chưa tính ship
    private BigDecimal customerPay; // Tổng tiền đã tính ship
    private Integer status;        // Trạng thái đơn hàng
    private Date createDate;       // Ngày tạo đơn hàng
    private Date estimatedDeliveryTime;       //  Thời gian giao dự kiến
    private Date createDateApprove;      // Thời gian phê duyệt
    private Date createDatePack;       // Thời gian đóng gói
    private Date createDateDelivering;       // Thời gian giao hàng
    private Date createDateComplete;      // Thời gian hoàn thành
    private Date createDateCancel;       // Thời gian hủy đơn
    private BigDecimal totalPriceDetail;
    private Integer quantity;
    private BigDecimal salePrice;
    private BigDecimal finalPrice;
    private String productName;
    private String sizeName;
    private String colorName;
    private String images;
    private String productCategory;
    private Long productId;
    private String productCode;
    private Long productDetailId;
    private Long idAddress;
    private Integer paymentType;
    private Integer paymentStatus ;
    private String fullName;
    private String phoneNumber;
    private BigDecimal deliveryCost; // phí ship
    private String addressFull;
    private List<OrderDetailDTO> lstOrderDetail;
    private Long idUser;
    private Integer deliveryType;
    private String createBy;
}
