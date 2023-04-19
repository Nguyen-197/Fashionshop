package com.portal.core.module.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Table(name = "detail_orders")
@Entity
@Data
public class DetailOrders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "orders_id")
    private Orders orders;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "productDetail_id")
    private ProductDetail productDetail;

    @OneToMany(mappedBy = "detailOrders")
    @JsonIgnore
    List<DetailReturn> detailReturnList;

}