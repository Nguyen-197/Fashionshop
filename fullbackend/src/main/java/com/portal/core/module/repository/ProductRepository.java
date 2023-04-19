
package com.portal.core.module.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.ProductForm;
import com.portal.core.module.dto.respon.ProductDTO;
import com.portal.core.module.entities.Category;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.Product;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface ProductRepository extends CRUDDao<Product, Long> {
    /**
     * List all Product
     */
    public List<Product> findAll();

	/**
     * List all Product paginate
     */
    public Page<Product> findAll(Pageable pageable);

default String buildGetDataQuery(ProductForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        p.id As id           ";
        nativeSQL += "       ,p.code As code         ";
        nativeSQL += "       ,p.name As name         ";
        nativeSQL += "       ,p.description As description  ";
        nativeSQL += "       ,p.is_delete As isDelete     ";
        nativeSQL += "       ,p.image As image        ";
        nativeSQL += "       ,p.id_category As idCategory   ";
        nativeSQL += "       ,p.mass As mass         ";
        nativeSQL += "       ,sum(pd.quantity) As quantity         ";
        nativeSQL += "       ,MIN(pd.final_price) as minPrice         ";
        nativeSQL += "       ,MAX(pd.final_price) AS maxPrice         ";
        nativeSQL += "       ,c.`name` as categoryName         ";
        nativeSQL += "       FROM product p";
        nativeSQL += "       LEFT JOIN product_detail pd ";
        nativeSQL += "       on p.id = pd.id_product ";
        nativeSQL += "       JOIN category c on p.id_category = c.id ";
        nativeSQL += "       LEFT JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       LEFT JOIN color cl on pd.id_color = cl.id ";
        String orderBy = " ORDER BY p.id DESC";
        String groupBy = " GROUP BY p.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "p.id");
        CommonUtils.filter(form.getCode(), strCondition, paramList, "p.code");
        CommonUtils.filter(form.getName(), strCondition, paramList, "p.name");
        CommonUtils.filter(form.getDescription(), strCondition, paramList, "dp.escription");
        CommonUtils.filter(form.getIsDelete(), strCondition, paramList, "p.is_delete");
//        CommonUtils.filter(form.getImage(), strCondition, paramList, "image");
        CommonUtils.filter(form.getIdCategory(), strCondition, paramList, "p.id_category");
        CommonUtils.filter(form.getListProductGender(), strCondition, paramList, "p.product_gender");
        CommonUtils.filterStr(form.getListProductSize(), strCondition, paramList, "s.code");
        CommonUtils.filterStr(form.getListProductColor(), strCondition, paramList, "cl.code");
        CommonUtils.filterStr(form.getListProductCategory(), strCondition, paramList, "c.code");
        return nativeSQL + strCondition.toString() + groupBy + orderBy;
    }

    default String buildGetDataQueryGetProductNew(ProductForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        p.id As id           ";
        nativeSQL += "       ,p.code As code         ";
        nativeSQL += "       ,p.name As name         ";
        nativeSQL += "       ,p.description As description  ";
        nativeSQL += "       ,p.is_delete As isDelete     ";
        nativeSQL += "       ,p.image As image        ";
        nativeSQL += "       ,p.id_category As idCategory   ";
        nativeSQL += "       ,p.mass As mass         ";
        nativeSQL += "       ,sum(pd.quantity) As quantity         ";
        nativeSQL += "       ,MIN(pd.final_price) as minPrice         ";
        nativeSQL += "       ,MAX(pd.final_price) AS maxPrice         ";
        nativeSQL += "       ,c.`name` as categoryName         ";
        nativeSQL += "       ,p.created_date AS createdDate       ";
        nativeSQL += "       FROM product p";
        nativeSQL += "       LEFT JOIN product_detail pd ";
        nativeSQL += "       on p.id = pd.id_product ";
        nativeSQL += "       JOIN category c on p.id_category = c.id ";
        nativeSQL += "       LEFT JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       LEFT JOIN color cl on pd.id_color = cl.id ";
        String orderBy = " ORDER BY p.created_date DESC";
        String groupBy = " GROUP BY p.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND p.created_date >= NOW() - INTERVAL 7 day ");
        strCondition.append(" AND p.is_delete = 0 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getCode(), strCondition, paramList, "code");
        CommonUtils.filter(form.getName(), strCondition, paramList, "name");
        CommonUtils.filter(form.getDescription(), strCondition, paramList, "description");
        CommonUtils.filter(form.getIsDelete(), strCondition, paramList, "is_delete");
        CommonUtils.filter(form.getIdCategory(), strCondition, paramList, "id_category");
        CommonUtils.filterStr(form.getListProductSize(), strCondition, paramList, "s.code");
        CommonUtils.filterStr(form.getListProductColor(), strCondition, paramList, "cl.code");
        CommonUtils.filterStr(form.getListProductCategory(), strCondition, paramList, "c.code");
        return nativeSQL + strCondition.toString() + groupBy + orderBy;
    }

    default String buildGetDataQueryGetProductSale(ProductForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        p.id As id           ";
        nativeSQL += "       ,p.code As code         ";
        nativeSQL += "       ,p.name As name         ";
        nativeSQL += "       ,p.description As description  ";
        nativeSQL += "       ,p.is_delete As isDelete     ";
        nativeSQL += "       ,p.image As image        ";
        nativeSQL += "       ,p.id_category As idCategory   ";
        nativeSQL += "       ,p.mass As mass         ";
        nativeSQL += "       ,sum(pd.quantity) As quantity         ";
        nativeSQL += "       ,MIN(pd.sale_price) as minPrice         "; // Min giá sale
        nativeSQL += "       ,MAX(pd.sale_price) AS maxPrice         "; // Max giá sale
        nativeSQL += "       ,c.`name` as categoryName         ";
        nativeSQL += "       ,p.created_date AS createdDate       ";
        nativeSQL += "       FROM product p";
        nativeSQL += "       LEFT JOIN product_detail pd ";
        nativeSQL += "       on p.id = pd.id_product ";
        nativeSQL += "       JOIN category c on p.id_category = c.id ";
        nativeSQL += "       LEFT JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       LEFT JOIN color cl on pd.id_color = cl.id ";
        String orderBy = " ORDER BY p.id DESC";
        String groupBy = " GROUP BY p.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND pd.sale_price is not null ");
        strCondition.append(" AND p.is_delete = 0 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getCode(), strCondition, paramList, "code");
        CommonUtils.filter(form.getName(), strCondition, paramList, "name");
        CommonUtils.filter(form.getDescription(), strCondition, paramList, "description");
        CommonUtils.filter(form.getIsDelete(), strCondition, paramList, "is_delete");
        CommonUtils.filter(form.getIdCategory(), strCondition, paramList, "id_category");
        CommonUtils.filterStr(form.getListProductSize(), strCondition, paramList, "s.code");
        CommonUtils.filterStr(form.getListProductColor(), strCondition, paramList, "cl.code");
        CommonUtils.filterStr(form.getListProductCategory(), strCondition, paramList, "c.code");
        return nativeSQL + strCondition.toString() + groupBy + orderBy;
    }


    default String buildQueryGetProductBestSale(ProductForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        p.id As id           ";
        nativeSQL += "       ,p.code As code         ";
        nativeSQL += "       ,p.name As name         ";
        nativeSQL += "       ,p.description As description  ";
        nativeSQL += "       ,p.is_delete As isDelete     ";
        nativeSQL += "       ,p.image As image        ";
        nativeSQL += "       ,p.id_category As idCategory   ";
        nativeSQL += "       ,p.mass As mass         ";
        nativeSQL += "       ,sum(pd.quantity) As quantity         ";
        nativeSQL += "       ,MIN(pd.sale_price) as minSalePrice         "; // Min giá sale
        nativeSQL += "       ,MAX(pd.sale_price) AS maxSalePrice         "; // Max giá sale
        nativeSQL += "       ,MIN(pd.final_price) as minPrice         "; // Min giá bán
        nativeSQL += "       ,MAX(pd.final_price) AS maxPrice         "; // Max giá bán
        nativeSQL += "       ,c.`name` as categoryName         ";
        nativeSQL += "       ,p.created_date AS createdDate       ";
        nativeSQL += "       ,sum(od.quantity) as sellNumber       "; // Số lượng đã bán
        nativeSQL += "       FROM product p";
        nativeSQL += "       JOIN category c on p.id_category = c.id ";
        nativeSQL += "       LEFT JOIN product_detail pd ";
        nativeSQL += "       on p.id = pd.id_product ";
        nativeSQL += "       LEFT JOIN detail_orders od on pd.id = od.product_detail_id ";
        nativeSQL += "       LEFT JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       LEFT JOIN color cl on pd.id_color = cl.id ";
        String orderBy = " ORDER BY od.quantity DESC";
        String groupBy = " GROUP BY p.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND p.is_delete = 0 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getCode(), strCondition, paramList, "code");
        CommonUtils.filter(form.getName(), strCondition, paramList, "name");
        CommonUtils.filter(form.getDescription(), strCondition, paramList, "description");
        CommonUtils.filter(form.getIsDelete(), strCondition, paramList, "is_delete");
        CommonUtils.filter(form.getIdCategory(), strCondition, paramList, "id_category");
        CommonUtils.filterStr(form.getListProductSize(), strCondition, paramList, "s.code");
        CommonUtils.filterStr(form.getListProductColor(), strCondition, paramList, "cl.code");
        CommonUtils.filterStr(form.getListProductCategory(), strCondition, paramList, "c.code");
        return nativeSQL + strCondition.toString() + groupBy + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param form
     * @return
     */
    default DataTableResults<Product> getDatatables(FilterData filterData, ProductForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Product.class);
    }

    /**
     * build query lấy danh sách sản phẩm mới nhất trong vòng 7 ngày
     *
     * @param filterData
     * @param form
     * @return
     */
    default DataTableResults<Product> getDatatablesProductNew(FilterData filterData, ProductForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQueryGetProductNew(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Product.class, 8);
    }

    /**
     * build query lấy danh sách sản phẩm đang sale
     *
     * @param filterData
     * @param form
     * @return
     */
    default DataTableResults<Product> getDatatablesProductSale(FilterData filterData, ProductForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQueryGetProductSale(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Product.class, 8);
    }

    /**
     * build query lấy danh sách sản phẩm bán chạy
     *
     * @param filterData
     * @param form
     * @return
     */
    default DataTableResults<Product> getDatatablesProductBestSale(FilterData filterData, ProductForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildQueryGetProductBestSale(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Product.class, 8);
    }

    @Modifying
    @Query("delete from Product u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    /**
     * Check trùng code
     */
    @Query("select p from Product p where lower(p.code) = lower(:code)")
    List<Product> findConflicCode(@Param("code") String code);

    @Query("select p from Product p where p.id <> :id and lower(p.code) = lower(:code)")
    List<Product> findConflicCode(@Param("id") Long id, @Param("code") String code);

    /**
     * Lấy danh sách sản phẩm
     * @param filterData
     * @return
     */
    default List<ProductDTO> getAllProduct(FilterData filterData, ProductForm form) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        p.id As id           ";
        nativeSQL += "       ,p.code As code         ";
        nativeSQL += "       ,p.name As name         ";
        nativeSQL += "       ,p.image As image        ";
        nativeSQL += "       ,sum(pd.quantity) As quantity         ";
        nativeSQL += "       ,MIN(pd.final_price) as minPrice         ";
        nativeSQL += "       ,MAX(pd.final_price) AS maxPrice         ";
        nativeSQL += "       FROM product p";
        nativeSQL += "       LEFT JOIN product_detail pd ";
        nativeSQL += "       on p.id = pd.id_product ";
        String orderBy = " ORDER BY p.id DESC";
        String groupBy = " GROUP BY p.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND p.is_delete = 0 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "p.id");
        CommonUtils.filter(form.getName(), strCondition, paramList, "p.name");
        CommonUtils.filter(form.getCode(), strCondition, paramList, "p.code");
        return filterData.list(nativeSQL + strCondition.toString() + groupBy + orderBy, paramList, ProductDTO.class);
    }

    default List<ProductDTO> findByIdProduct(FilterData filterData, Long idProduct) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        p.id As id           ";
        nativeSQL += "       ,p.code As code         ";
        nativeSQL += "       ,p.name As name         ";
        nativeSQL += "       ,p.description As description  ";
        nativeSQL += "       ,p.is_delete As isDelete     ";
        nativeSQL += "       ,p.image As image        ";
        nativeSQL += "       ,p.id_category As idCategory   ";
        nativeSQL += "       ,p.mass As mass         ";
        nativeSQL += "       ,sum(pd.quantity) As quantity         ";
        nativeSQL += "       ,MIN(pd.sale_price) as minSalePrice         "; // Min giá sale
        nativeSQL += "       ,MAX(pd.sale_price) AS maxSalePrice         "; // Max giá sale
        nativeSQL += "       ,MIN(pd.final_price) as minPrice         "; // Min giá bán
        nativeSQL += "       ,MAX(pd.final_price) AS maxPrice         "; // Max giá bán
        nativeSQL += "       ,c.`name` as categoryName         ";
        nativeSQL += "       ,p.created_date AS createdDate       ";
        nativeSQL += "       FROM product p";
        nativeSQL += "       LEFT JOIN product_detail pd ";
        nativeSQL += "       on p.id = pd.id_product ";
        nativeSQL += "       JOIN category c on p.id_category = c.id ";
        String orderBy = " ORDER BY p.created_date DESC";
        String groupBy = " GROUP BY p.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND p.is_delete = 0 ");
        if (CommonUtils.NVL(idProduct) > 0L) {
            strCondition.append(" AND p.id = ?");
            paramList.add(idProduct);
        }
        return filterData.list(nativeSQL + strCondition.toString() + groupBy + orderBy, paramList, ProductDTO.class);
    }

    @Modifying
    @Query("UPDATE Product SET isDelete = :status WHERE id = :idProduct")
    void stopSellingProducts(@Param("status") Boolean status,@Param("idProduct") Long idProduct);

    List<Product> findAllByCategory(Category category);
}
