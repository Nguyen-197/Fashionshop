package com.portal.project.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product")
    private Long    product;
    
    @Column(name = "role_id")
    private Long    roleId;
    
    @Column(name = "first_name")
    private String  firstName;

    @Column(name = "last_name")
    private String  lastName;

    @Column(name = "full_name")
    private String  fullName;

    @Column(name = "email")
    private String  email;

    @Column(name = "phone_number")
    private Long    phoneNumber;
    
    @Column(name = "password")
    private Long    password;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date    createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Date    updatedAt;
    
}
