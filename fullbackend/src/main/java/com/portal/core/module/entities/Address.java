package com.portal.core.module.entities;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Cache;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="address")
public class Address {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="address_detail")
    private String addressDetail;

    @Column(name="address_full")
    private String addressFull;

    @Column(name = "district")
    private String district;

    @Column(name = "province")
    private String province;

    @Column(name = "ward")
    private String ward;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "is_default")
    private Boolean isDefault;        // Đặt địa chỉ mặc định: 1 là mặc định

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
