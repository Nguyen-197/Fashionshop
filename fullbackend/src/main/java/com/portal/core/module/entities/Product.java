package com.portal.core.module.entities;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.portal.core.module.dto.ProductDetailForm;
import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
@Entity
@Table(name = "product")
public class Product {

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

    @Column(name = "is_delete")
    private Boolean isDelete;

    @Column(name = "image")
    private String image;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    @Column(name = "mass")
    private Integer mass;

    @Column(name = "product_gender")
    private Integer productGender;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product")
    private List<ProductDetail> listProductDetail;

    @Column(name = "created_Date")
    private Date createdDate;
    
    @Transient
    private Integer quantity;

    @Transient
    private String categoryName;

    @Transient
    private Long idCategory;

    @Transient
    private BigDecimal minPrice;

    @Transient
    private BigDecimal maxPrice;

    @Transient
    private BigDecimal minSalePrice; //Min giá sale

    @Transient
    private BigDecimal maxSalePrice; //Max giá sale

    @Transient
    private Integer sellNumber; //Số lượng đã bán

}
