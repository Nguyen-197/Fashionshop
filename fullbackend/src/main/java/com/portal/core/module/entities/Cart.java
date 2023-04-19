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
@Table(name = "cart")
public class Cart {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_product_details")
    private ProductDetail productDetail;

    @Column(name = "quantity")
    private Integer quantity;

}
