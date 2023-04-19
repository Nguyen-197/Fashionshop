package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.DetailOrdersForm;
import com.portal.core.module.dto.respon.OrderDetailDTO;
import com.portal.core.module.entities.DetailOrders;
import com.portal.core.module.entities.Orders;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
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
public interface DetailOrdersRepository extends CRUDDao<DetailOrders, Long> {
    /**
     * List all DetailOrders
     */
    public List<DetailOrders> findAll();

	/**
     * List all DetailOrders paginate
     */
    public Page<DetailOrders> findAll(Pageable pageable);

default String buildGetDataQuery(DetailOrdersForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,price As price        ";
        nativeSQL += "       ,quantity As quantity     ";
        nativeSQL += "       FROM detail_orders ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getTotalPrice(), strCondition, paramList, "price");
        CommonUtils.filter(form.getQuantity(), strCondition, paramList, "quantity");
        return nativeSQL + strCondition.toString() + orderBy;
    }


    default DataTableResults<DetailOrders> getDatatables(FilterData filterData, DetailOrdersForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, DetailOrders.class);
    }

    @Modifying
    @Query("delete from DetailOrders u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    void deleteAllByOrders(Orders orders);

    /**
     * Lấy chi tiết sản phẩm trong đơn hàng
     * @param filterData
     * @param idOrder
     * @return
     */
    default List<OrderDetailDTO> getProductDetailByIdOrder(FilterData filterData, Long idOrder) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        odt.orders_id as orderId    ";
        nativeSQL += "       , odt.total_price AS totalPrice         ";
        nativeSQL += "       , odt.unit_price AS unitPrice         ";
        nativeSQL += "       , odt.quantity as quantity   ";
        nativeSQL += "       , odt.quantity as quantityBuy   ";
        nativeSQL += "       , p.`code` as code           ";
        nativeSQL += "       , p.`name` as productName    ";
        nativeSQL += "       , s.`name` as sizeName       ";
        nativeSQL += "       , c.`name` as colorName      ";
        nativeSQL += "       , pd.image as image          ";
        nativeSQL += "       FROM detail_orders odt ";
        nativeSQL += "       JOIN product_detail pd on odt.product_detail_id = pd.id ";
        nativeSQL += "       JOIN product p on pd.id_product = p.id ";
        nativeSQL += "       JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       JOIN color c on pd.id_color = c.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND odt.orders_id = ? ");
        paramList.add(idOrder);
        return filterData.list(nativeSQL + strCondition, paramList, OrderDetailDTO.class);
    }

    /**
     * Query lấy danh sách sản phẩm và số lượng có thể đổi trả
     * @param filterData
     * @param idOrder
     * @return
     */
    default List<OrderDetailDTO> getListOrderDetailsProbablyReturnByIdOrder(FilterData filterData, Long idOrder) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = " SELECT ";
        nativeSQL += "        odt.id as id    ";
        nativeSQL += "       , odt.orders_id as orderId    ";
        nativeSQL += "       , odt.total_price as totalPrice         ";
        nativeSQL += "       , odt.unit_price as unitPrice         ";
        nativeSQL += "       , p.`name` as productName   ";
        nativeSQL += "       , p.`code` as productCode   ";
        nativeSQL += "       , s.`name` as sizeName          ";
        nativeSQL += "       , c.`name` as colorName    ";
        nativeSQL += "       , pd.image as image       ";
        nativeSQL += "       , odt.quantity - COALESCE((SELECT SUM( dr1.quantity ) FROM detail_return dr1 WHERE dr1.order_detail_id = odt.id ), 0) AS quantity      ";
        nativeSQL += "       FROM detail_orders odt ";
        nativeSQL += "       JOIN product_detail pd on pd.id = odt.product_detail_id ";
        nativeSQL += "       JOIN product p on p.id = pd.id_product ";
        nativeSQL += "       JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       JOIN color c on pd.id_color = c.id ";
        nativeSQL += "       LEFT JOIN detail_return dr on odt.id = dr.order_detail_id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND odt.quantity > COALESCE((SELECT SUM( dr1.quantity ) FROM detail_return dr1 WHERE dr1.order_detail_id = odt.id ), 0) ");
        strCondition.append(" AND odt.orders_id = ? ");
        String groupBy = " GROUP BY odt.id ";
        paramList.add(idOrder);
        return filterData.list(nativeSQL + strCondition + groupBy, paramList, OrderDetailDTO.class);
    }
}
