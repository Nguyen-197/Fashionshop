package com.portal.core.module.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class UserRequest {

    private Integer id;

    private String phoneNumber;

    private String fullName;

    private String password;

    private String email;

    private Boolean Active;

    private Long roleId;
}
