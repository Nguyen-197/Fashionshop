
package com.portal.core.module.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.CategoryForm;
import com.portal.core.module.dto.ProductDetailForm;
import com.portal.core.module.dto.respon.ProductDetailDTO;
import com.portal.core.module.entities.Color;
import com.portal.core.module.entities.Product;
import com.portal.core.module.entities.Size;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.ProductDetail;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface ProductDetailRepository extends CRUDDao<ProductDetail, Long> {
    /**
     * List all ProductDetail
     */
    public List<ProductDetail> findAll();

	/**
     * List all ProductDetail paginate
     */
    public Page<ProductDetail> findAll(Pageable pageable);

    default String buildGetDataQuery(ProductDetailForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,id_size As idSize       ";
        nativeSQL += "       ,id_color As idColor      ";
        nativeSQL += "       ,quantity As quantity     ";
        nativeSQL += "       ,sale_price As salePrice        ";
        nativeSQL += "       ,cost_price As costPrice        ";
        nativeSQL += "       ,final_price As finalPrice        ";
        nativeSQL += "       ,image As image        ";
        nativeSQL += "       ,id_product As idProduct        ";
        nativeSQL += "       ,is_delete As isDelete     ";
        nativeSQL += "       FROM product_detail ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getIdSize(), strCondition, paramList, "id_size");
        CommonUtils.filter(form.getIdColor(), strCondition, paramList, "id_color");
        CommonUtils.filter(form.getIdProduct(), strCondition, paramList, "id_product");
        CommonUtils.filter(form.getIsDelete(), strCondition, paramList, "is_delete");
        CommonUtils.filter(form.getFinalPrice(), strCondition, paramList, "final_price");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param ProductDetailForm sysCatForm
     * @return
     */
    default DataTableResults<ProductDetail> getDatatables(FilterData filterData, ProductDetailForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, ProductDetail.class);
    }

    @Modifying
    @Query("delete from ProductDetail u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    void deleteAllByProduct(Product product);

    List<ProductDetail> findAllByProduct(Product product);

    /**
     * Build Query lấy chi tiết sản phẩm theo size, color
     * @param filterData
     * @param idProduct
     * @param idSize
     * @param idColor
     * @return
     */
    default List<ProductDetailDTO> getProductDetailByCondition(FilterData filterData, Long idProduct, Long idSize, Long idColor) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += "        pd.id as id           ";
        sql += "       , pd.sale_price as salePrice         ";
        sql += "       , pd.final_price as finalPrice  ";
        sql += "       , p.`name` as productName  ";
        sql += "       , pd.quantity as quantity  ";
        sql += "       , pd.image as image         ";
        sql += "       , s.`name` as sizeName  ";
        sql += "       , cl.`name` as colorName  ";
        sql += "       FROM product_detail pd ";
        sql += "       JOIN product p on pd.id_product = p.id ";
        sql += "       JOIN size s on s.id = pd.id_size ";
        sql += "       JOIN color cl on cl.id = pd.id_color ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        if (idProduct != null) {
            strCondition.append(" AND pd.id_product = ?1");
            paramList.add(idProduct);
        }
        if (idSize != null) {
            strCondition.append(" AND pd.id_size = ?2");
            paramList.add(idSize);
        }
        if (idColor != null) {
            strCondition.append(" AND pd.id_color = ?3");
            paramList.add(idColor);
        }
        return filterData.list(sql+strCondition, paramList, ProductDetailDTO.class);
    }

    default List<ProductDetailDTO> getAllByIdProduct(FilterData filterData, Long idProduct) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += "        pd.id as id           ";
        sql += "       , pd.sale_price as salePrice         ";
        sql += "       , pd.final_price as finalPrice  ";
        sql += "       , p.`name` as productName  ";
        sql += "       , pd.quantity as quantity  ";
        sql += "       , pd.image as image         ";
        sql += "       , s.`name` as sizeName  ";
        sql += "       , cl.`name` as colorName  ";
        sql += "       FROM product_detail pd ";
        sql += "       JOIN product p on pd.id_product = p.id ";
        sql += "       JOIN size s on s.id = pd.id_size ";
        sql += "       JOIN color cl on cl.id = pd.id_color ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        if (idProduct != null) {
            strCondition.append(" AND pd.id_product = ?");
            paramList.add(idProduct);
        }
        return filterData.list(sql+ strCondition, paramList, ProductDetailDTO.class);
    }

    @Modifying
    @Query("update ProductDetail set quantity = (quantity - :quantity) where id = :id")
    void updateQuantityProductDetail(@Param("quantity") Integer quantity, @Param("id") Long id);


    /**
     * Search productDetails
     * @param form
     * @param paramList
     * @return
     */
    default DataTableResults<ProductDetailDTO> searchProductDetails(FilterData filterData, ProductDetailForm form) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += "        pd.id as id           ";
        sql += "       , pd.sale_price as salePrice         ";
        sql += "       , pd.final_price as finalPrice  ";
        sql += "       , p.`name` as productName  ";
        sql += "       , pd.`id_product` as idProduct  ";
        sql += "       , p.`mass` as mass  ";   // Khối lượng
        sql += "       , pd.quantity as quantity  ";
        sql += "       , pd.image as image         ";
        sql += "       , s.`name` as sizeName  ";
        sql += "       , cl.`name` as colorName  ";
        sql += "       , c.`name` as categoryName  ";
        sql += "       FROM product_detail pd ";
        sql += "       JOIN product p on pd.id_product = p.id ";
        sql += "       JOIN category c on c.id = p.id_category ";
        sql += "       JOIN size s on s.id = pd.id_size ";
        sql += "       JOIN color cl on cl.id = pd.id_color ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "pd.id");
        CommonUtils.filter(form.getIdProduct(), strCondition, paramList, "pd.id_product");
        CommonUtils.filter(form.getIsDelete(), strCondition, paramList, "is_delete");
        CommonUtils.filter(form.getFinalPrice(), strCondition, paramList, "final_price");
        CommonUtils.filter(form.getSalePrice(), strCondition, paramList, "sale_price");
        CommonUtils.filter(form.getSizeName(), strCondition, paramList, "s.name");
        CommonUtils.filter(form.getColorName(), strCondition, paramList, "cl.name");
        return filterData.findPaginationQuery(sql + strCondition.toString(), paramList, ProductDetailDTO.class);
    }


    /**
     * Hàm lấy danh sách id chi tiết sản phẩm theo danh mục và đang được sale
     * @param idCategory
     * @return idProductDetail
     */
    @Query("SELECT pd.id FROM Product p JOIN ProductDetail pd ON p.id = pd.product.id JOIN Category c on p.category.id = c.id WHERE (p.category.id = :idCategory OR c.parentId = :idCategory ) AND pd.salePrice IS NOT NULL ")
    List<Long> findAllProductSaleOfByCategory(@Param("idCategory") Long idCategory);


    /**
     * Hàm lấy danh sách id chi tiết sản phẩm theo sản phẩm và đang được sale
     * @param idProduct
     * @return
     */
    @Query("SELECT pd.id FROM Product p JOIN ProductDetail pd ON p.id = pd.product.id WHERE p.id = :idProduct AND pd.salePrice IS NOT NULL ")
    List<Long> findAllProductSaleOfByProduct(@Param("idProduct") Long idProduct);

    /**
     * Hàm lấy danh sách id chi tiết sản phẩm theo danh mục và chưa được sale
     * @param idCategory
     * @return
     */
    @Query("SELECT new ProductDetail(pd.id, pd.finalPrice) FROM Product p JOIN ProductDetail pd ON p.id = pd.product.id JOIN Category c on p.category.id = c.id WHERE (p.category.id = :idCategory OR c.parentId = :idCategory ) AND pd.salePrice IS NULL ")
    List<ProductDetail> findAllProductNotSaleOfByCategory(@Param("idCategory") Long idCategory);

    /**
     * Hàm lấy danh sách id chi tiết sản phẩm theo sản phẩm và chưa được sale
     * @param idProduct
     * @return
     */
    @Query("SELECT new ProductDetail(pd.id, pd.finalPrice) FROM Product p JOIN ProductDetail pd ON p.id = pd.product.id WHERE p.id = :idProduct AND pd.salePrice IS NULL ")
    List<ProductDetail> findAllProductNotSaleOfByProduct(@Param("idProduct") Long idProduct);

    /**
     * hàm ngừng sale sản phẩm
     * @param idProductDetail
     */
    @Modifying
    @Query("UPDATE ProductDetail SET salePrice = null WHERE id = :idProductDetail")
    void stopSaleOffProduct(@Param("idProductDetail") Long idProductDetail);

    @Modifying
    @Query("UPDATE ProductDetail SET salePrice = :salePrice WHERE id = :idProductDetail")
    void startSaleOffProduct(@Param("salePrice") BigDecimal salePrice, @Param("idProductDetail") Long idProductDetail);

    List<ProductDetail> findAllBySize(Size size);

    List<ProductDetail> findAllByColor(Color color);

}
