package com.portal.project.forms;

import lombok.Data;

//import javax.persistence.Column;

@Data
public class UserForm {
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
