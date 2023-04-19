package com.portal.core.module.entities;


import javax.persistence.*;

import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
@Entity
@Table(name = "favories")
public class Favories {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

}
