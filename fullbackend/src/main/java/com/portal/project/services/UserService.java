package com.portal.project.services;

import com.portal.project.dtos.UserDTO;
import com.portal.project.forms.UserForm;

public interface UserService {
	
    UserDTO save(UserForm form);
}
