package com.portal.core.module.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.DetailReturn;
import com.portal.core.module.dto.DetailReturnForm;
import com.portal.core.module.service.DetailReturnService;

@Controller
@RequestMapping("/v1/detail-return")
public class DetailReturnController extends CRUDController<DetailReturn, DetailReturnForm> {

    @Autowired
    private DetailReturnService detailReturnService;

    @Override
    protected CRUDService<DetailReturn, DetailReturnForm> getMainService() {
        return detailReturnService;
    }

    @Override
    protected Class<DetailReturn> getClassEntity() {
        return DetailReturn.class;
    }
}
