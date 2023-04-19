package com.portal.core.module.entities;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
@Entity
@Table(name = "product_detail")
public class ProductDetail {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_size")
    private Size size;

    @ManyToOne
    @JoinColumn(name = "id_color")
    private Color color;

    @Column(name = "quantity")
    private Integer quantity;

    //Gia nhap
    @Column(name = "cost_price")
    private BigDecimal costPrice;

    //Gia sale
    @Column(name = "sale_price")
    private BigDecimal salePrice;

    //Gia ban
    @Column(name = "final_price")
    private BigDecimal finalPrice;

    @Column(name = "image")
    private String image;

    @Column(name = "is_delete")
    private Boolean isDelete;

    @ManyToOne
    @JoinColumn(name = "id_product")
    @JsonIgnore
    private Product product;

    @OneToMany(mappedBy = "productDetail")
    @JsonIgnore
    List<DetailOrders> detailOrdersList;

    public ProductDetail() {
    }

    public ProductDetail(Long id, BigDecimal finalPrice) {
        this.id = id;
        this.finalPrice = finalPrice;
    }
}
