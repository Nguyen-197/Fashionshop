
package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.CartForm;
import com.portal.core.module.dto.respon.CartDTO;
import com.portal.core.module.entities.ProductDetail;
import com.portal.core.module.entities.User;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.Cart;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface CartRepository extends CRUDDao<Cart, Long> {
    /**
     * List all Cart
     */
    public List<Cart> findAll();

	/**
     * List all Cart paginate
     */
    public Page<Cart> findAll(Pageable pageable);

    default String buildGetDataQuery(CartForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,id_user As idUser       ";
        nativeSQL += "       ,id_product_details As idProductDetails ";
        nativeSQL += "       ,quantity As quantity     ";
        nativeSQL += "       FROM cart ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getIdProductDetails(), strCondition, paramList, "id_product_details");
        CommonUtils.filter(form.getQuantity(), strCondition, paramList, "quantity");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param CartForm sysCatForm
     * @return
     */
    default DataTableResults<Cart> getDatatables(FilterData filterData, CartForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Cart.class);
    }

    @Modifying
    @Query("delete from Cart u where u.id in ?1")
    void deleteByIds(List<Long> ids);


    @Query("SELECT c from Cart c where c.user.id = :idUser and c.productDetail.id = :idProductDetail")
    Cart checkProductExistInTheCart(@Param("idUser") Long idUser, @Param("idProductDetail") Long idProductDetail);

    default String buildQueryGetCartByUserLogin(List<Object> paramList, Long idUser) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        c.id As id           ";
        nativeSQL += "       ,c.quantity AS quantity       ";
        nativeSQL += "       ,pd.sale_price as salePrice ";
        nativeSQL += "       ,pd.final_price as finalPrice     ";
        nativeSQL += "       ,pd.image as image       ";
        nativeSQL += "       ,s.`name` as sizeName ";
        nativeSQL += "       ,cl.`name` as colorName     ";
        nativeSQL += "       ,c.`id_product_details` as idProductDetail     ";
        nativeSQL += "       ,p.`name` as productName     ";
        nativeSQL += "       ,c.`id_product_details` as idProductDetail     ";
        nativeSQL += "       ,p.`id` as idProduct     ";
        nativeSQL += "       FROM cart c";
        nativeSQL += "       JOIN product_detail pd ON c.id_product_details = pd.id ";
        nativeSQL += "       JOIN product p ON p.id = pd.id_product ";
        nativeSQL += "       JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       JOIN color cl on pd.id_color = cl.id ";
        String orderBy = " ORDER BY c.id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND c.id_user = ?");
        paramList.add(idUser);
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * Lấy sản phẩm trong giỏ hàng theo user login
     * @param filterData
     * @param idUser
     * @return
     */
    default List<CartDTO> getCartByUserLogin(FilterData filterData, Long idUser) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildQueryGetCartByUserLogin(paramList, idUser);
        return filterData.list(nativeQuery, paramList, CartDTO.class);
    }

    default String buildQueryGetDetailsCartByIdCart(List<Object> paramList, Long idUser, List<Long> listIdCart) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        c.id As id           ";
        nativeSQL += "       ,c.quantity AS quantity       ";
        nativeSQL += "       ,pd.sale_price as salePrice ";
        nativeSQL += "       ,pd.final_price as finalPrice     ";
        nativeSQL += "       ,pd.image as image       ";
        nativeSQL += "       ,s.`name` as sizeName ";
        nativeSQL += "       ,cl.`name` as colorName     ";
        nativeSQL += "       ,p.`name` as productName     ";
        nativeSQL += "       ,p.`id` as idProduct     ";
        nativeSQL += "       ,pd.id as idProductDetail       ";
        nativeSQL += "       ,p.`mass` as mass     ";
        nativeSQL += "       FROM cart c";
        nativeSQL += "       JOIN product_detail pd ON c.id_product_details = pd.id ";
        nativeSQL += "       JOIN product p ON p.id = pd.id_product ";
        nativeSQL += "       JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       JOIN color cl on pd.id_color = cl.id ";
        String orderBy = " ORDER BY c.id DESC";

        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");

        strCondition.append(" AND c.id_user = ?1");
        paramList.add(idUser);
        if(!CommonUtils.isNullOrEmpty(listIdCart)) {
            strCondition.append(" AND c.id in (?2) ");
            paramList.add(listIdCart);
        }
        return nativeSQL + strCondition.toString() + orderBy;
    }
    /**
     * Lấy sản phẩm trong giỏ hàng theo user login và danh sách id cart
     * @param filterData
     * @param idUser
     * @return
     */
    default List<CartDTO> getCartByUserLogin(FilterData filterData, Long idUser, List<Long> listIdCart) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildQueryGetDetailsCartByIdCart(paramList, idUser, listIdCart);
        return filterData.list(nativeQuery, paramList, CartDTO.class);
    }

    @Modifying
    @Query("delete from Cart where user.id = :idUser and productDetail.id = :idProductDetail")
    void removeProductFromCart(@Param("idUser") Long idUser, @Param("idProductDetail") Long idProductDetail);
}
