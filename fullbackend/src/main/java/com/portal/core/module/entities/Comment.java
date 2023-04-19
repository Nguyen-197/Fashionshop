package com.portal.core.module.entities;

import java.util.Date;

import javax.persistence.*;

import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
@Entity
@Table(name = "comment")
public class Comment {

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

    @Column(name = "contents")
    private String contents;

    @Column(name = "date")
    private Date date;

    @Column(name = "id_parent")
    private Long idParent;

}
