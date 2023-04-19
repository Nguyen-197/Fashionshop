package com.portal.core.module.entities;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.*;

import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
@Entity
@Table(name = "promotion")
public class Promotion {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "promotion_type")
    private Integer promotionType;         // Loại khuyến mãi : 1) Khuyến mãi theo danh mục sản phẩm 2) Khuyến mãi theo sản phẩm

    @Column(name = "is_active")
    private Integer isActive;              // Trạng thái hoạt động 1) Hoạt động 2) Ngừng hoạt động

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "promotion")
    List<PromotionDetail> listPromotionDetail;

}
