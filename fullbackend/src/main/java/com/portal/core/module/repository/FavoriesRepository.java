
package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.FavoriesForm;
import com.portal.core.module.dto.respon.CartDTO;
import com.portal.core.module.dto.respon.FavoriesDTO;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.Favories;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface FavoriesRepository extends CRUDDao<Favories, Long> {
    /**
     * List all Favories
     */
    public List<Favories> findAll();

	/**
     * List all Favories paginate
     */
    public Page<Favories> findAll(Pageable pageable);

    default String buildGetDataQuery(FavoriesForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,id_user As idUser       ";
        nativeSQL += "       ,id_product As idProduct    ";
        nativeSQL += "       FROM favories ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
//        CommonUtils.filter(form.getIdUser(), strCondition, paramList, "id_user");
        CommonUtils.filter(form.getIdProduct(), strCondition, paramList, "id_product");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param form sysCatForm
     * @return
     */
    default DataTableResults<Favories> getDatatables(FilterData filterData, FavoriesForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Favories.class);
    }

    @Modifying
    @Query("delete from Favories u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    default String buildQueryGetFavoriesByUserLogin(List<Object> paramList, Long idUser) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        fa.id As id           ";
        nativeSQL += "       ,fa.id as id ";
        nativeSQL += "       ,fa.id_product as idProduct     ";
        nativeSQL += "       ,p.`name` as productName       ";
        nativeSQL += "       ,c.`name` as categoryName       ";
        nativeSQL += "       ,p.image as image ";
        nativeSQL += "       ,p.description As description    ";
        nativeSQL += "       ,sum(pd.quantity) As quantity     ";
        nativeSQL += "       ,MIN(pd.final_price) as minPrice       "; // Min giá bán
        nativeSQL += "       ,MAX(pd.final_price) AS maxPrice ";       // Max giá bán
        nativeSQL += "       ,MIN(pd.sale_price) as minSalePrice    "; // Min giá sale
        nativeSQL += "       ,MAX(pd.sale_price) AS maxSalePrice     ";// Max giá sale
        nativeSQL += "       FROM favories fa";
        nativeSQL += "       JOIN product p ON p.id = fa.id_product ";
        nativeSQL += "       JOIN category c ON c.id = p.id_category ";
        nativeSQL += "       JOIN product_detail pd ON p.id = pd.id_product ";
        String orderBy = " ORDER BY fa.id DESC ";
        String groupBy = " GROUP BY p.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND fa.id_user = ?");
        paramList.add(idUser);
        return nativeSQL + strCondition.toString() + groupBy + orderBy;
    }

    /**
     * Lấy sản phẩm trong giỏ hàng theo user login
     * @param filterData
     * @param idUser
     * @return
     */
    default DataTableResults<FavoriesDTO> getFavoriesByUserLogin(FilterData filterData, Long idUser) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildQueryGetFavoriesByUserLogin(paramList, idUser);
        return filterData.findPaginationQuery(nativeQuery, paramList, FavoriesDTO.class);
    }
}
