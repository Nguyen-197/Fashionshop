package com.portal.project.dtos;

import lombok.Data;

@Data
public class UserDTO {
    private Long    userId;
    private Long    userAccountId;
    private String  firstName;
    private String  middleName;
    private String  lastName;
    private String  fullName;
    private String  nickname;
    private String  username;
    private Long    gender;
}
