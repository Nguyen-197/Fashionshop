package com.portal.core.module.entities;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
@Entity
@Table(name = "returns")
public class Return {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "return_code")
    private String returnCode;      // Mã đơn đổi trả

    @Column(name = "status")
    private Integer status;         // Trạng thái đơn đổi trả 1) Chờ xác nhận 2) Chưa nhận lại hàng 3) Đã nhận lại hàng

    @Column(name = "status_refund")
    private Integer statusRefund;   // Trạng thái hoàn tiền 1) Chưa hoàn tiền 2) Đã hoàn tiền

    @Column(name = "total_refund")
    private BigDecimal totalRefund; // Tổng tiền hoàn trả

    @Column(name = "reason")
    private String reason;   // Lý do trả

    @Column(name = "create_date")
    private Date createDate;   // Ngày tạo đơn

    @Column(name = "create_by")
    private String createBy;   // Người tạo đơn

    @Column(name = "create_date_receive")
    private Date createDateReceive;   // Ngày nhận hàng

    @Column(name = "create_date_payment")
    private Date createDatePayment;   // Ngày thanh toán

    @Column(name = "is_exchangeable")
    private Integer isExchangeable;         // Đơn hàng có đổi trả = >> 1) Trả lại hàng 2) Đổi trả hàng

    @ManyToOne
    @JoinColumn(name = "id_orders")
    @JsonIgnore
    private Orders orders;

    @OneToMany(mappedBy = "returns")
    List<DetailReturn> detailReturnList;

}
