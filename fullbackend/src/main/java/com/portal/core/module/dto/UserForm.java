package com.portal.core.module.dto;

import com.portal.core.module.entities.Role;
import lombok.Data;

import java.util.List;

@Data
public class UserForm {

    private Long id;

    private String phoneNumber;

    private String fullName;

    private String password;
    
    private String newPassword;
    
    private String email;

    private Boolean active;

    private Role role;

    private List<Long> roles;
}
