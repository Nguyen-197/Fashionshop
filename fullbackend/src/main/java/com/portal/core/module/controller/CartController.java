
package com.portal.core.module.controller;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.constant.SecurityUtils;
import com.portal.core.module.dto.respon.CartDTO;
import com.portal.core.module.entities.User;
import com.portal.core.module.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Cart;
import com.portal.core.module.dto.CartForm;
import com.portal.core.module.service.CartService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@CrossOrigin("*")
@Controller
@RequestMapping("/api/v1/cart")
public class CartController extends CRUDController<Cart, CartForm> {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @Override
    protected CRUDService<Cart, CartForm> getMainService() {
        return cartService;
    }

    @Override
    protected Class<Cart> getClassEntity() {
        return Cart.class;
    }

    @GetMapping("/get-cart")
    public Response getCartByUser() {
        try {
            User userInfo = userService.getInfomationUser();
            if (userInfo == null) {
                return Response.error(Constants.RESPONSE_CODE.RECORD_DELETED);
            }
            return Response.success().withData(cartService.findAllByUser(userInfo));
        } catch (Exception | ValidateException e) {
            e.printStackTrace();
            return Response.error(Constants.RESPONSE_CODE.SERVER_ERROR);
        }
    }
    @GetMapping("/find-by-ids")
    public Response findByIdCart(@RequestParam List<Long> listIdCarts) throws ValidateException {
        List<CartDTO> listCart = cartService.findByUserLoginAndIdCart(listIdCarts);
        if (CommonUtils.isNullOrEmpty(listCart)) {
            return Response.error(Constants.RESPONSE_CODE.RECORD_DELETED);
        }
        return Response.success().withData(listCart);
    }
}
