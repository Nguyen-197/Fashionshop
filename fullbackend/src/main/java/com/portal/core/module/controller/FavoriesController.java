
package com.portal.core.module.controller;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.entities.User;
import com.portal.core.module.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Favories;
import com.portal.core.module.dto.FavoriesForm;
import com.portal.core.module.service.FavoriesService;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/api/v1/favories")
public class FavoriesController extends CRUDController<Favories, FavoriesForm> {

    @Autowired
    private FavoriesService favoriesService;

    @Autowired
    private UserService userService;

    @Override
    protected CRUDService<Favories, FavoriesForm> getMainService() {
        return favoriesService;
    }

    @Override
    protected Class<Favories> getClassEntity() {
        return Favories.class;
    }

    @GetMapping("/get-favories")
    public Response getFavoriesByUserLogin() {
        try {
            User userInfo = userService.getInfomationUser();
            if (userInfo == null) {
                return Response.error(Constants.RESPONSE_CODE.RECORD_DELETED);
            }
            return Response.success().withData(favoriesService.findAllByUser(userInfo));
        } catch (Exception | ValidateException e) {
            e.printStackTrace();
            return Response.error(Constants.RESPONSE_CODE.SERVER_ERROR);
        }
    }
}
