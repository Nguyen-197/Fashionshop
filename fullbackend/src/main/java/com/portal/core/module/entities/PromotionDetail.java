package com.portal.core.module.entities;


import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
@Entity
@Table(name = "promotion_detail")
public class PromotionDetail {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_promotion")
    @JsonIgnore
    private Promotion promotion;

    @Column(name = "object_id")
    private Long objectId;              // Đối tượng khuyến mãi

    @Column(name = "discount_type")
    private Integer discountType;       // 1) Khuyến mãi theo giá trị 2) Khuyễn mãi theo phần trăm

    @Column(name = "discount")
    private Long discount;       // Chiết khấu

    @Column(name = "promotion_limited")
    private Long promotionLimited;      // Giới hạn khuyến mãi

}
