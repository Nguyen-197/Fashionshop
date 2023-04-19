package com.portal.core.module.controller;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.entities.Return;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.dto.ReturnForm;
import com.portal.core.module.service.ReturnService;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/api/v1/return")
public class ReturnController extends CRUDController<Return, ReturnForm> {

    @Autowired
    private ReturnService returnService;

    @Override
    protected CRUDService<Return, ReturnForm> getMainService() {
        return returnService;
    }

    @Override
    protected Class<Return> getClassEntity() {
        return Return.class;
    }

    /**
     * API tạo đơn trả hàng cho customer
     * @param request
     * @param returnForm
     * @return
     */
    @PostMapping("/customer/return-order/")
    public Response returnOrderCustomer(HttpServletRequest request, ReturnForm returnForm) throws ValidateException {
        return Response.success().withData(returnService.createReturnOrderCustomer(returnForm));
    }

    /**
     * API Thay đổi trạng thái của đơn trả hàng
     * @param idReturn
     * @return
     */
    @PostMapping("/admin/approve-return-order/{idReturn}")
    public Response changeStatusReturnOrder(@PathVariable("idReturn") Long idReturn, @RequestParam Integer status) throws ValidateException {
        return returnService.changeStatusReturnOrder(idReturn, status);
    }

    /**
     * API Xác nhận đơn trả đã thanh toán
     * @param idReturn
     * @return
     */
    @PostMapping("/admin/change-status-refund/{idReturn}")
    public Response changeStatusRefund(@PathVariable("idReturn") Long idReturn) throws ValidateException {
        return returnService.changeStatusRefund(idReturn);
    }

    /**
     * API lấy danh sách đơn hàng đổi trả
     * @param returnForm
     * @return
     */
    @GetMapping("/admin/search-return-order")
    public Response searchReturnOrder(ReturnForm returnForm) {
        try {
            return Response.success().withData(returnService.searchReturnOrder(returnForm));
        } catch (Exception e) {
            e.printStackTrace();
            return Response.error(Constants.RESPONSE_CODE.RECORD_DELETED);
        }
    }

    /**
     * API lấy chi tiết đơn đổi trả
     * @param idReturn
     * @return
     */
    @GetMapping("/admin/get-detail-return/{idReturn}")
    public Response getDetailReturn(@PathVariable("idReturn") Long idReturn) {
        return returnService.getDetailRetun(idReturn);
    }

}
