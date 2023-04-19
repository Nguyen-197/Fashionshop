package com.portal.core.module.entities;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.math.BigDecimal;


@Data
@Entity
@Table(name = "detail_return")
public class DetailReturn {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "quantity")
    private Integer quantity;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_detail_id")
    private DetailOrders detailOrders;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "returns_id")
    private Return returns;

}
