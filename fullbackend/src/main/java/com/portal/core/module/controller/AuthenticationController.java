package com.portal.core.module.controller;


import com.portal.core.common.config.TokenProvider;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.module.dto.UserForm;
import com.portal.core.module.dto.request.loginForm;
import com.portal.core.module.dto.respon.LoginFormResponse;
import com.portal.core.module.entities.User;
import com.portal.core.module.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {

	@Autowired
	private UserService userService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private TokenProvider jwtTokenUtil;

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody Response login(@RequestBody loginForm vo) {
		try {
			final Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(vo.getUsername(), vo.getPassword()));
			// Lấy token của người dùng
			SecurityContextHolder.getContext().setAuthentication(authentication);
			final String token = jwtTokenUtil.generateToken(authentication);

			// Gán lại giá trị cho UserVo để hiển thị lên thông tin
			// Từ Username lấy thông tin của member
			User users = userService.findByEmailOrPhoneNumber(vo.getUsername());
			LoginFormResponse loginFormResponse = new LoginFormResponse();
			loginFormResponse.setId(users.getId());
			loginFormResponse.setUsername(users.getFullName());
			loginFormResponse.setEmail(users.getEmail());
			loginFormResponse.setToken(token);
			List<String> permissions = authentication.getAuthorities().stream()
					.map(item -> item.getAuthority())
					.collect(Collectors.toList());
			loginFormResponse.setRoles(permissions);
			return Response.success("login.success").withData(loginFormResponse);
		} catch (AuthenticationException e) {
			throw new BadCredentialsException("Tài khoản hoặc mật khẩu không chính xác");
		}
	}
	@RequestMapping(value = "/sign-in" , method = RequestMethod.POST)
	public @ResponseBody Response signUp(@RequestBody UserForm userForm) throws ValidateException, Exception {
		User user = new User();
		user = userService.findByEmailOrPhoneNumber(userForm.getEmail());
		if(!CommonUtils.isEmpty(user)) {
			return Response.error("error.exist.userEmail");
		}
		user = userService.findByEmailOrPhoneNumber(userForm.getPhoneNumber());
		if(!CommonUtils.isEmpty(user)) {
			return Response.error("error.exist.userPhone");
		}
		user = new User();
		user = userService.saveOrUpdate(user, userForm);
		return Response.success("signup.success").withData(user);
	}
}

