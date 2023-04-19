package com.portal.core.module.controller;

import com.portal.core.common.exception.ValidateException;
//import com.portal.core.module.service.ExportPdfService;
//import org.apache.commons.io.IOUtils;
import com.portal.core.common.result.Response;
import com.portal.core.module.dto.respon.OrderDTO;
import com.portal.core.module.service.ExportPdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Orders;
import com.portal.core.module.dto.OrdersForm;
import com.portal.core.module.service.OrdersService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/orders")
public class OrdersController extends CRUDController<Orders, OrdersForm> {

    @Autowired
    private OrdersService ordersService;

    @Autowired
    private ExportPdfService exportPdfService;

    @Override
    protected CRUDService<Orders, OrdersForm> getMainService() {
        return ordersService;
    }

    @Override
    protected Class<Orders> getClassEntity() {
        return Orders.class;
    }

    @GetMapping("/search-order")
    public Response searchOrder(OrdersForm ordersForm) {
        return Response.success().withData(ordersService.searchOrder(ordersForm));
    }

    @GetMapping("/downloadBill/{id}")
    public void downloadBillOnline(HttpServletResponse response, @PathVariable Long id) throws IOException, ValidateException {
        response.setContentType("application/pdf");
        DateFormat dateFormat = new SimpleDateFormat("YYYY-MM-DD:HH:MM:SS");
        String currentDateTime = dateFormat.format(new Date());
        String headerkey = "Content-Disposition";
        String headervalue = "attachment; filename=pdf_" + currentDateTime + ".pdf";
        response.setHeader(headerkey, headervalue);
        exportPdfService.generate(response, id);
    }

    /**
     * Api đặt hàng dành cho user
     */
    @PostMapping("/customer/create-order")
    public Response createOrderCustomer(HttpServletRequest httpServletRequest, @RequestBody OrdersForm ordersForm) throws ValidateException {
        return Response.success().withData(ordersService.createOrderCustomer(ordersForm));
    }

    /**
     * API lấy danh sách đơn hàng theo trạng thái của userLogin
     * @param status
     * @return
     */
    @GetMapping("/get-order-by-status")
    public Response getOrderByCode(@RequestParam Integer status) throws ValidateException {
        return Response.success().withData(ordersService.getOrderByStatus(status));
    }

    /**
     * API huỷ đơn hàng cho client
     * @return
     */
    @PostMapping("/customer/cancel-order/{idOrder}")
    public Response cancelOrderCustomer(@PathVariable("idOrder") Long idOrder ) {
        return ordersService.cancelOrderCustomer(idOrder);
    }

    /**
     * API huỷ đơn hàng cho admin
     * @param idOrder
     * @return
     */
    @PostMapping("/admin/cancel-order/{idOrder}")
    public Response cancelOrderAdmin(@PathVariable("idOrder") Long idOrder) {
        return ordersService.cancelOrderAdmin(idOrder);
    }


    /**
     * API Thay đổi trạng thái đơn hàng admin
     * @param idOrder
     * @param status
     * @return
     */
    @PostMapping("/admin/change-status-order/{idOrder}")
    public Response changeStatusOrder(@PathVariable("idOrder") Long idOrder, @RequestParam Integer status) {
        return ordersService.changeStatusOrder(idOrder, status);
    }

    /**
     * API Thay đổi trạng thái thanh toán với đơn hàng nhận tại cửa hàng
     * @param idOrder
     * @return
     */
    @PostMapping("/admin/change-payment-status/{idOrder}")
    public Response changePaymentStatus(@PathVariable("idOrder") Long idOrder) throws ValidateException {
        return ordersService.changePaymentStatus(idOrder);
    }

    /**
     * API xem chi tiết đơn hàng
     * @param idOrder
     * @return
     */
    @GetMapping("/admin/find-order-by-id/{idOrder}")
    public Response findOrderByIdOrder(@PathVariable("idOrder") Long idOrder) {
        return Response.success().withData(ordersService.findOrderById(idOrder));
    }

    /**
     * API lấy danh sách đơn hàng có thể đổi trả
     * @return
     */
    @GetMapping("/admin/get-order-probably-return")
    public Response getOrderProbablyReturn(OrdersForm ordersForm) {
        return Response.success().withData(ordersService.getOrderProbablyReturn(ordersForm));
    }

    /**
     * API lấy thông tin và số lượng sản phẩm có thể đổi trả
     * @param idOrder
     * @return
     */
    @GetMapping("/admin/get-order-detail-probably-return/{idOrder}")
    public Response getOrderDetailProbablyReturn(@PathVariable("idOrder") Long idOrder) {
        return Response.success().withData(ordersService.getOrderDetailProbablyReturn(idOrder));
    }
}