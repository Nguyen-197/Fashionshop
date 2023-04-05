package com.portal.project.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portal.project.dtos.UserDTO;
import com.portal.project.forms.UserForm;
import com.portal.project.services.UserService;
import com.portal.project.utils.Response;

@RestController
@CrossOrigin("*")
@RequestMapping("/v1/user")
public class UserController {
	@Autowired
	private UserService userService;

	@PostMapping("/add")
    private Response searchFriend(@RequestBody UserForm userForm)  {
		UserDTO userAdd = userService.save(userForm);
        return Response.success().withData(userAdd);
    }
}
