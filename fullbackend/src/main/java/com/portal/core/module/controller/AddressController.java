package com.portal.core.module.controller;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.AddressForm;
import com.portal.core.module.dto.respon.AddressDTO;
import com.portal.core.module.entities.Address;
import com.portal.core.module.entities.User;
import com.portal.core.module.service.AddressService;
import com.portal.core.module.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

@Controller
@RequestMapping("/api/v1/address")
public class AddressController extends CRUDController<Address, AddressForm> {

    @Autowired
    private AddressService addressService;

    @Autowired
    private UserService userService;

    @Override
    protected CRUDService<Address, AddressForm> getMainService() {
        return addressService;
    }

    @Override
    protected Class<Address> getClassEntity() {
        return Address.class;
    }

    @GetMapping("/get-list")
    public Response findAddressByUserLogin(HttpServletRequest request) throws ValidateException, URISyntaxException, IOException, InterruptedException {
        User userInfo = userService.getInfomationUser();
        if (userInfo == null) {
            return Response.error(Constants.RESPONSE_CODE.RECORD_DELETED);
        }
        List<AddressDTO> listAddressDTO = addressService.findAllByUser(userInfo);
        return Response.success().withData(listAddressDTO);
    }

    @GetMapping("/find-all-by-user/{idUser}")
    public Response findAllByUser(@PathVariable("idUser") Long idUser ) {
        try {
            List<Address> listAddress = addressService.findAllByUser(idUser);
//            if (CommonUtils.isNullOrEmpty(listAddress)) {
//                return Response.warning(Constants.RESPONSE_CODE.RECORD_DELETED);
//            }
            return Response.success().withData(listAddress);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.error(Constants.RESPONSE_CODE.SERVER_ERROR);
        }
    }
}
