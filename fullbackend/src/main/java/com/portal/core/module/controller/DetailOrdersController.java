package com.portal.core.module.controller;

import com.portal.core.common.result.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.DetailOrders;
import com.portal.core.module.dto.DetailOrdersForm;
import com.portal.core.module.service.DetailOrdersService;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/api/v1/detail-orders")
public class DetailOrdersController extends CRUDController<DetailOrders, DetailOrdersForm> {

    @Autowired
    private DetailOrdersService detailOrdersService;

    @Override
    protected CRUDService<DetailOrders, DetailOrdersForm> getMainService() {
        return detailOrdersService;
    }

    @Override
    protected Class<DetailOrders> getClassEntity() {
        return DetailOrders.class;
    }

    @GetMapping("/admin/get-detail/{idOrder}")
    public Response getDetailOrder(@PathVariable("idOrder") Long idOrder) {
        return Response.success().withData(detailOrdersService.getProductDetailByIdOrder(idOrder));
    }
}
