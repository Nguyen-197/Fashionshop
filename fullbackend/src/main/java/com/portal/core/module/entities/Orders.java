package com.portal.core.module.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Table(name = "orders")
@Entity
@Data

@AllArgsConstructor
@NoArgsConstructor
public class Orders {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code")
    private String orderCode;

    @Column(name = "code_lading")
    private String codeLading;    // Mã vận đơn

//    @Column(name ="full_name")
//    private String fullName;
//
//    @Column(name ="phone_number")
//    private String phoneNumber;

//    @Column(name = "address_name")
//    private String addressName;
//
//    @Column(name = "address_detail")
//    private String addressDetail;

    @Column(name = "create_by")
    private String createBy;

    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "delivery_cost")
    private BigDecimal deliveryCost;   // Phí ship

    @Column(name = "status")
    private Integer status;             // Trạng thái của đơn hàng: 1- Đặt hàng 2- Duyệt 3- Đóng gói 4- Xuất kho 5- Hoàn thành 6- Huỷ đơn

    @Column(name = "payment_status")
    private Integer paymentStatus ;   // Trạng thái thanh toán 1) Chưa thanh toán - 2) Đã thanh toán

    @Column(name = "total_price")
    private BigDecimal totalPrice;   // Tổng tiền chưa tính ship

    @Column(name = "customer_pay")
    private BigDecimal customerPay;   // Tổng tiền đã tính ship

    @Column(name = "payment_type")
    private Integer paymentType; // Phương thức thanh toán 1) thanh toán online - 2) Thanh toán khi nhận hàng;

    @Column(name = "delivery_type")
    private Integer deliveryType; // Phương thức giao hàng 1) Nhận tại cửa hàng - 2) Giao qua hãng vận chuyển;

    @Column(name = "estimated_delivery_time")
    private Date estimatedDeliveryTime; // Thời gian giao hàng dự kiến

    @Column(name = "create_date_approve")
    private Date createDateApprove;         // Thời gian phê duyệt đơn hàng

    @Column(name = "create_date_pack")
    private Date createDatePack;         // Thời gian đóng gói

    @Column(name = "create_date_delivering")
    private Date createDateDelivering;         // Thời gian xuất kho

    @Column(name = "create_date_complete")
    private Date createDateComplete;            // Thời gian hoàn thành đơn hàng

    @Column(name = "create_date_cancel")
    private Date createDateCancel;         // Thời gian hủy đơn hàng

    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonIgnore
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "orders",cascade =CascadeType.ALL)
    List<DetailOrders> listOrderDetail = new ArrayList<>();

    @OneToMany(mappedBy = "orders")
    @JsonIgnore
    List<Return> returnList ;

    @ManyToOne
    @JoinColumn(name = "id_address")
    @JsonIgnore
    private Address address;

}
