package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;

import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.OrdersForm;
import com.portal.core.module.dto.respon.AnalyticsDTO;
import com.portal.core.module.dto.respon.OrderDTO;
import com.portal.core.module.entities.Orders;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface OrdersRepository extends CRUDDao<Orders, Long> {
    /**
     * List all Orders
     */
    public List<Orders> findAll();

	/**
     * List all Orders paginate
     */
    public Page<Orders> findAll(Pageable pageable);

//default String buildGetDataQuery(OrdersForm form, List<Object> paramList) {
//        String nativeSQL = "SELECT ";
//        nativeSQL += "        id As id           ";
//        nativeSQL += "       ,address_detail As addressDetail ";
//        nativeSQL += "       ,address_name As addressName  ";
//        nativeSQL += "       ,create_date As createDate   ";
//        nativeSQL += "       ,delivery_cost As deliveryCost ";
//        nativeSQL += "       ,full_name As fullName     ";
//        nativeSQL += "       ,phone_number As phoneNumber  ";
//        nativeSQL += "       ,status As status       ";
//        nativeSQL += "       FROM orders ";
//        String orderBy = " ORDER BY id DESC";
//        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
//        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
////        CommonUtils.filter(form.getAddressDetail(), strCondition, paramList, "address_detail");
////        CommonUtils.filter(form.getAddressName(), strCondition, paramList, "address_name");
//        CommonUtils.filter(form.getCreateDate(), strCondition, paramList, "create_date");
//        CommonUtils.filter(form.getDeliveryCost(), strCondition, paramList, "delivery_cost");
////        CommonUtils.filter(form.getFullName(), strCondition, paramList, "full_name");
////        CommonUtils.filter(form.getPhoneNumber(), strCondition, paramList, "phone_number");
////        CommonUtils.filter(form.getStatus(), strCondition, paramList, "status");
//        return nativeSQL + strCondition.toString() + orderBy;
//    }

//    default DataTableResults<Orders> getDatatables(FilterData filterData, OrdersForm form ) {
//        List<Object> paramList = new ArrayList<>();
//        String nativeQuery = buildGetDataQuery(form, paramList);
//        return filterData.findPaginationQuery(nativeQuery, paramList, Orders.class);
//    }
    default DataTableResults<OrderDTO> getDatatables(FilterData filterData, OrdersForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        o.id as id          ";
        nativeSQL += "       , o.order_code as orderCode          ";
        nativeSQL += "       , o.code_lading as codeLading          ";  // Mã vận đơn
        nativeSQL += "       ,o.total_price as totalPrice  "; // Tổng tiền chưa tính ship
        nativeSQL += "       ,o.customer_pay as customerPay  ";   // Tổng tiền đã tính ship
        nativeSQL += "       ,o.`status` as status   "; // Trạng thái đơn hàng
        nativeSQL += "       ,o.create_date as createDate "; // Ngày mua
        nativeSQL += "       ,o.id_address AS idAddress  ";
        nativeSQL += "       ,o.payment_type as paymentType   "; // Phương thức thanh toán
        nativeSQL += "       ,o.payment_status as paymentStatus "; // Trạng thái thanh toán
        nativeSQL += "       ,o.delivery_cost as deliveryCost ";   // Phí ship
        nativeSQL += "       ,a.full_name AS fullName  ";
        nativeSQL += "       ,a.phone_number as phoneNumber   ";
        nativeSQL += "       ,a.address_full as addressFull   ";
        nativeSQL += "       FROM orders o  ";
        nativeSQL += "       JOIN address a ON o.id_address = a.id   ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "o.id");
        CommonUtils.filter(form.getOrderCode(), strCondition, paramList, "o.order_code");
        CommonUtils.filter(form.getCodeLading(), strCondition, paramList, "o.code_lading");
        CommonUtils.filter(form.getCreateDate(), strCondition, paramList, "o.create_date");
        CommonUtils.filter(form.getPaymentType(), strCondition, paramList, "o.payment_type");
        CommonUtils.filter(form.getPaymentStatus(), strCondition, paramList, "o.payment_status");
        CommonUtils.filter(form.getStatus(), strCondition, paramList, "o.status");
        CommonUtils.filter(form.getFullName(), strCondition, paramList, "a.full_name");
        CommonUtils.filter(form.getPhoneNumber(), strCondition, paramList, "a.phone_number");
        String orderBy = " ORDER BY o.id DESC";
        return filterData.findPaginationQuery(nativeSQL + strCondition + orderBy, paramList, OrderDTO.class);
    }

    @Modifying
    @Query("delete from Orders u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    Optional<Orders> findById(Long id);

    default List<OrderDTO> getOrderByStatus(FilterData filterData, Integer status, Long idUser) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        o.id as id          ";
        nativeSQL += "       , o.order_code as orderCode          ";
        nativeSQL += "       , o.code_lading as codeLading          ";  // Mã vận đơn
        nativeSQL += "       ,o.total_price as totalPrice  ";   // Tổng tiền chưa tính ship
        nativeSQL += "       ,o.customer_pay as customerPay  ";   // Tổng tiền đã tính ship
        nativeSQL += "       ,o.`status` as status   "; // Trạng thái đơn hàng
        nativeSQL += "       ,o.create_date as createDate "; // Ngày mua
        nativeSQL += "       ,odt.quantity as quantity  ";
        nativeSQL += "       ,pd.sale_price as salePrice      ";
        nativeSQL += "       ,pd.final_price as finalPrice     ";
        nativeSQL += "       ,p.`name` as productName  ";
        nativeSQL += "       ,s.`name` as sizeName      ";
        nativeSQL += "       ,c.`name` as colorName      ";
        nativeSQL += "       ,pd.`image` as images      ";
        nativeSQL += "       ,ct.`name` as productCategory      ";
        nativeSQL += "       ,p.`id` as productId      ";
        nativeSQL += "       ,p.`code` as productCode      ";
        nativeSQL += "       ,pd.`id` as productDetailId      ";
        nativeSQL += "       FROM orders o  ";
        nativeSQL += "       JOIN detail_orders odt on o.id = odt.orders_id ";
        nativeSQL += "       JOIN product_detail pd on odt.product_detail_id = pd.id ";
        nativeSQL += "       JOIN product p on pd.id_product = p.id ";
        nativeSQL += "       JOIN category ct on ct.id = p.id_category ";
        nativeSQL += "       JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       JOIN color c on c.id = pd.id_color ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND o.id_user = ?");
        paramList.add(idUser);
        strCondition.append(" AND o.status = ?");
        paramList.add(status);
        String orderBy = " ORDER BY o.id DESC";
        return filterData.list(nativeSQL + strCondition + orderBy, paramList, OrderDTO.class);
    }

    @Query(value = "SELECT o.* from Orders o " +
            "where " +
            "payment_status = false and create_date is not null and payment_type = 1 " +
            "and create_date < DATE_SUB(now(), INTERVAL 24 HOUR);",nativeQuery = true)
    public List<Orders> getListOrderOverduePayment();


    @Modifying
    @Query(value = "update\n" +
            "    product_detail\n" +
            "        join detail_orders d\n" +
            "on product_detail.id = d.product_detail_id\n" +
            "set\n" +
            "    product_detail.quantity= COALESCE(product_detail.quantity,0) + d.quantity\n" +
            "where d.orders_id=?1",nativeQuery = true)
    public void updateQuantity(Long orders_id);

    @Modifying
    @Query("update Orders SET status = 6, createDateCancel = current_time where id = :idOrder and status = 1")
    void cancelOrderCustomer(Long idOrder);

    @Modifying
    @Query("update Orders SET status = 6, createDateCancel = current_time  where id = :idOrder and ( status <> 4 or status <> 5 )")
    void cancelOrderAdmin(Long idOrder);

    @Modifying
    @Query("update Orders SET status = :status where id = :idOrder and ( status <> 5 or status <> 6 )")
    void updateStatusAdmin(@Param("status") Integer status, @Param("idOrder") Long idOrder);

    @Modifying
    @Query("UPDATE Orders SET paymentStatus = 2 where id = :idOrder and deliveryType = 1")
    void updatePaymentStatusWithOrderInStore(@Param("idOrder") Long idOrder);

    /**
     * Query lấy chi tiết 1 đơn hàng
     * @param filterData
     * @param idOrder
     * @return
     */
    default List<OrderDTO> findOrderById(FilterData filterData, Long idOrder) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        o.id as id          ";
        nativeSQL += "       , o.order_code as orderCode          ";
        nativeSQL += "       , o.code_lading as codeLading          ";  // Mã vận đơn
        nativeSQL += "       ,o.total_price as totalPrice  "; // Tổng tiền chưa tính ship
        nativeSQL += "       ,o.customer_pay as customerPay  ";   // Tổng tiền đã tính ship
        nativeSQL += "       ,o.`status` as status   "; // Trạng thái đơn hàng
        nativeSQL += "       ,o.create_date as createDate "; // Ngày tạo
        nativeSQL += "       ,o.estimated_delivery_time as estimatedDeliveryTime "; // Thời gian giao dự kiến
        nativeSQL += "       ,o.create_date_approve as createDateApprove "; // Thời gian phê duyệt
        nativeSQL += "       ,o.create_date_pack as createDatePack "; // Thời gian đóng gói
        nativeSQL += "       ,o.create_date_delivering as createDateDelivering "; // Thời gian giao hàng
        nativeSQL += "       ,o.create_date_complete as createDateComplete "; // Thời gian hoàn thành
        nativeSQL += "       ,o.create_date_cancel as createDateCancel "; // Thời gian hủy đơn
        nativeSQL += "       ,o.id_address AS idAddress  ";
        nativeSQL += "       ,o.payment_type as paymentType   "; // Phương thức thanh toán
        nativeSQL += "       ,o.payment_status as paymentStatus "; // Trạng thái thanh toán
        nativeSQL += "       ,o.delivery_cost as deliveryCost ";   // Phí ship
        nativeSQL += "       ,a.full_name AS fullName  ";
        nativeSQL += "       ,a.phone_number as phoneNumber   ";
        nativeSQL += "       ,a.address_full as addressFull   ";
        nativeSQL += "       ,o.id_user as idUser   ";
        nativeSQL += "       ,o.delivery_type as deliveryType   ";
        nativeSQL += "       FROM orders o  ";
        nativeSQL += "       JOIN address a ON o.id_address = a.id   ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        if (idOrder != null) {
            strCondition.append(" AND o.id = ? ");
            paramList.add(idOrder);
        }
        return filterData.list(nativeSQL + strCondition, paramList, OrderDTO.class);
    }

    default DataTableResults<OrderDTO> getOrderProbablyReturn(FilterData filterData, OrdersForm form) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = " SELECT ";
        nativeSQL += " o.id AS id, ";
        nativeSQL += " o.order_code AS orderCode, ";
        nativeSQL += " o.create_date AS createDate, ";
        nativeSQL += " o.create_date_complete AS createDateComplete, ";
        nativeSQL += " o.total_price AS totalPrice, ";
        nativeSQL += " o.customer_pay AS customerPay, ";
        nativeSQL += " o.create_by AS createBy, ";
        nativeSQL += " a.full_name AS fullName,  ";
        nativeSQL += " a.phone_number AS phoneNumber  ";
        nativeSQL += " FROM orders o ";
        nativeSQL += " JOIN address a ON o.id_address = a.id ";
        nativeSQL += " JOIN detail_orders odt ON o.id = odt.orders_id AND o.status = ? ";
        nativeSQL += " LEFT JOIN `returns` r ON o.id = r.id_orders ";
        nativeSQL += " LEFT JOIN detail_return dr ON r.id = dr.returns_id  ";
        nativeSQL += " AND dr.order_detail_id = odt.id";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND odt.quantity > COALESCE((SELECT SUM( dr1.quantity ) FROM detail_return dr1 WHERE dr1.order_detail_id = odt.id ), 0) ");
        strCondition.append(" AND o.create_date_complete > NOW() - INTERVAL 7 DAY ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "o.id");
        CommonUtils.filter(form.getOrderCode(), strCondition, paramList, "o.order_code");
        CommonUtils.filter(form.getCreateDate(), strCondition, paramList, "o.create_date");
        CommonUtils.filter(form.getCreateDateComplete(), strCondition, paramList, "o.create_date_complete");
        CommonUtils.filter(form.getFullName(), strCondition, paramList, "a.full_name");
        CommonUtils.filter(form.getPhoneNumber(), strCondition, paramList, "a.phone_number");
        String groupBy = " GROUP BY o.id ";
        String orderBy = " ORDER BY o.id DESC";
        paramList.add(Constants.STATUS_ORDER.COMPLETE_ORDER);
        return filterData.findPaginationQuery(nativeSQL, strCondition.toString(), groupBy, orderBy, paramList, OrderDTO.class);
    }

    /**
     * Query lấy thông tin đơn hàng cần đổi trả
     * @param filterData
     * @param idOrder
     * @return
     */
    default OrderDTO getOrderProbablyReturn(FilterData filterData, Long idOrder) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        o.id as id          ";
        nativeSQL += "       , o.order_code as orderCode          ";
        nativeSQL += "       , o.code_lading as codeLading          ";  // Mã vận đơn
        nativeSQL += "       ,o.id_address AS idAddress  ";
        nativeSQL += "       ,a.full_name AS fullName  ";
        nativeSQL += "       ,a.phone_number as phoneNumber   ";
        nativeSQL += "       ,a.address_full as addressFull   ";
        nativeSQL += "       ,o.id_user as idUser   ";
        nativeSQL += "       FROM orders o  ";
        nativeSQL += "       JOIN address a ON o.id_address = a.id   ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        if (idOrder != null) {
            strCondition.append(" AND o.id = ? ");
            paramList.add(idOrder);
        }
        return filterData.get(nativeSQL + strCondition, paramList, OrderDTO.class);
    }

    default AnalyticsDTO totalStatusOrder(FilterData filterData, Integer date, Integer status, String obj) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += " COUNT(o.`status`) as countStatus ";
        sql += " FROM `orders` o ";
        StringBuilder strCondition = new StringBuilder(" Where 1 = 1 ");
        strCondition.append(" AND o.status = ? ");
        paramList.add(status);
        strCondition.append(" AND o." +obj+"  > NOW() - INTERVAL ? DAY  ");
        paramList.add(date);
        return filterData.get(sql + strCondition, paramList, AnalyticsDTO.class);
    }

    default AnalyticsDTO totalReturnOrder(FilterData filterData, Integer date) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += " SUM(r.total_refund) as totalPriceReturn, ";
        sql += " COUNT(r.id) as totalReturn ";
        sql += " FROM `returns` r ";
        StringBuilder strCondition = new StringBuilder(" Where 1 = 1 ");
        strCondition.append(" AND r.`status` = ? ");
        paramList.add(Constants.STATUS_RETURN.ITEM_RECEIVED);
        strCondition.append(" AND r.create_date_receive > NOW() - INTERVAL ? DAY  ");
        paramList.add(date);
        return filterData.get(sql + strCondition, paramList, AnalyticsDTO.class);
    }

    default AnalyticsDTO totalOrder(FilterData filterData, Integer date) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += " COUNT(o.`id`) as totalOrder ";
        sql += " FROM `orders` o ";
        StringBuilder strCondition = new StringBuilder(" Where 1 = 1 ");
        strCondition.append(" AND o.create_date  > NOW() - INTERVAL ? DAY  ");
        paramList.add(date);
        return filterData.get(sql + strCondition, paramList, AnalyticsDTO.class);
    }

    default AnalyticsDTO totalPriceOrder(FilterData filterData, Integer date) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += " SUM( o.total_price ) AS totalPrice ";
        sql += " FROM `orders` o ";
        StringBuilder strCondition = new StringBuilder(" Where 1 = 1 ");
        strCondition.append(" AND o.`status` = 5  ");
        strCondition.append(" AND o.create_date  > NOW() - INTERVAL ? DAY  ");
        paramList.add(date);
        return filterData.get(sql + strCondition, paramList, AnalyticsDTO.class);
    }
}
