package com.portal.core.module.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "u_user")
@Getter
@Setter
public class User implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "password")
    private String password;
    
    @Column(name = "email")
    private String email;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    List<Address> listAddress ;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    List<Orders> ordersList;

    @Transient
    private Long roleId;

    @Transient
    private String roleName;
    
    @Transient
    private Long totalPriceDone;
    
    @Transient
    private Integer totalOrderDone;
}
