package com.portal.core.module.entities;


import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
@Entity
@Table(name = "size")
public class Size {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "size")
    @JsonIgnore
    private List<ProductDetail> listProductDetail;

}
