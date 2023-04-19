package com.portal.core.module.controller;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.UserForm;
import com.portal.core.module.entities.User;
import com.portal.core.module.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
public class UserController extends CRUDController<User, UserForm> {

    @Autowired
    UserService userService;

    @Override
    protected CRUDService<User, UserForm> getMainService() {
        return userService;
    }

    @Override
    protected Class<User> getClassEntity() {
        return User.class;
    }

    @GetMapping("/info")
    public Response getInfomationUser() {
        try {
            User userInfo = userService.getInfomationUser();
            return Response.success().withData(userInfo);
        } catch (ValidateException e) {
            e.printStackTrace();
            return Response.error(Constants.RESPONSE_CODE.SERVER_ERROR);
        }
    }

    @GetMapping("")
    public ResponseEntity<List<User>> getListUser( Pageable pageable,
                                                  @RequestParam(value = "id", required = false) Long id,
                                                  @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
                                                  @RequestParam(value = "fullName", required = false) String fullName,
                                                  @RequestParam(value = "email", required = false) String email){

        return ResponseEntity.ok(userService.getListUser(pageable,id,phoneNumber,fullName,email));
    }


    @GetMapping("/get-all-customer")
    public Response getAllCustomer(UserForm userForm) {
        try {
            return Response.success().withData(userService.getAllCustomer(userForm));
        }catch (Exception e) {
            return Response.error(Constants.RESPONSE_CODE.SERVER_ERROR);
        }
    }
}
