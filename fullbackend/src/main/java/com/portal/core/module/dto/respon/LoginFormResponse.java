package com.portal.core.module.dto.respon;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
public class LoginFormResponse {

    private String token;
    private Long id;
    private String username;
    private String email;
//    private Collection<? extends GrantedAuthority> permissions;
    private List<String> roles;
}