package com.portal.core.module.service;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.respon.AnalyticsDTO;
import com.portal.core.module.repository.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService extends CRUDService {

    @Autowired
    private OrdersRepository ordersRepository;
    @Override
    protected CRUDDao getBaseDao() {
        return null;
    }

    @Override
    public DataTableResults getDataTables(Object form) {
        return null;
    }

    /**
     * Hàm tính tổng số đơn trả hàng theo trạng thái đơn hàng
     * @param date
     * @return
     */
    public Response totalStatusOrder(Integer date) {
        Map<Integer, AnalyticsDTO> mapStatusOrder = new HashMap<>();

        // Tổng đơn đặt hàng
        AnalyticsDTO analyticsOrder = ordersRepository.totalStatusOrder(filterData, date, Constants.STATUS_ORDER.ORDER, "create_date");
        mapStatusOrder.put(1, analyticsOrder);

        // Tổng đơn duyệt
        AnalyticsDTO analyticsApprove = ordersRepository.totalStatusOrder(filterData, date, Constants.STATUS_ORDER.APPROVE_ORDER, "create_date_approve");
        mapStatusOrder.put(2, analyticsApprove);

        // Tổng đơn đóng gói
        AnalyticsDTO analyticsPackOrder = ordersRepository.totalStatusOrder(filterData, date, Constants.STATUS_ORDER.PACK_ORDER, "create_date_pack");
        mapStatusOrder.put(3, analyticsPackOrder);

        // Tổng đơn đang giao
        AnalyticsDTO analyticsDelivering = ordersRepository.totalStatusOrder(filterData, date, Constants.STATUS_ORDER.DELIVERING, "create_date_delivering");
        mapStatusOrder.put(4, analyticsDelivering);

        // Tổng đơn hoàn thành
        AnalyticsDTO analyticsComplateOrder = ordersRepository.totalStatusOrder(filterData, date, Constants.STATUS_ORDER.COMPLETE_ORDER, "create_date_complete");
        mapStatusOrder.put(5, analyticsComplateOrder);

        // Tổng đơn hoàn thành
        AnalyticsDTO analyticsCancelOrder = ordersRepository.totalStatusOrder(filterData, date, Constants.STATUS_ORDER.CANCEL_ORDER, "create_date_cancel");
        mapStatusOrder.put(6, analyticsCancelOrder);

        return Response.success().withData(mapStatusOrder);
    }

    /**
     * Hàm tính tổng số tiền trả hàng và tổng số đơn trả hàng
     * @param date
     * @return
     */
    public Response totalReturnOrder(Integer date) {
        AnalyticsDTO analyticsCancelOrder = ordersRepository.totalReturnOrder(filterData, date);
        return Response.success().withData(analyticsCancelOrder);
    }

    /**
     * Hàm tính tổng số đơn hàng
     * @param date
     * @return
     */
    public Response totalOrder(Integer date) {
        AnalyticsDTO analyticsCancelOrder = ordersRepository.totalOrder(filterData, date);
        return Response.success().withData(analyticsCancelOrder);
    }

    /**
     * Hàm tính tổng số tiền của đơn đã thanh toán
     * @param date
     * @return
     */
    public Response totalPriceOrder(Integer date) {
        AnalyticsDTO analyticsCancelOrder = ordersRepository.totalPriceOrder(filterData, date);
        return Response.success().withData(analyticsCancelOrder);
    }
}
