package com.portal.core.module.dto.respon;

import com.portal.core.module.entities.Address;
import com.portal.core.module.entities.Role;
import lombok.Data;

import java.util.List;

@Data
public class UserRespon {

    private Long id;


    private String phoneNumber;

    private String fullName;

    private String password;

    private String email;

    private Boolean active;

//    private List<Role> roles;

    List<Address> listAddress ;
}
