
package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.PromotionDetailForm;
import com.portal.core.module.dto.respon.PromotionDetailDTO;
import com.portal.core.module.entities.Promotion;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.PromotionDetail;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface PromotionDetailRepository extends CRUDDao<PromotionDetail, Long> {
    /**
     * List all PromotionDetail
     */
    public List<PromotionDetail> findAll();

	/**
     * List all PromotionDetail paginate
     */
    public Page<PromotionDetail> findAll(Pageable pageable);

default String buildGetDataQuery(PromotionDetailForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,id_promotion As idPromotion  ";
        nativeSQL += "       ,object_id As objectId     ";
        nativeSQL += "       ,discount_type As discountType ";
        nativeSQL += "       ,promotion_limited As promotionLimited ";
        nativeSQL += "       FROM promotion_detail ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getIdPromotion(), strCondition, paramList, "id_promotion");
        CommonUtils.filter(form.getObjectId(), strCondition, paramList, "object_id");
        CommonUtils.filter(form.getDiscountType(), strCondition, paramList, "discount_type");
        CommonUtils.filter(form.getPromotionLimited(), strCondition, paramList, "promotion_limited");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param PromotionDetailForm sysCatForm
     * @return
     */
    default DataTableResults<PromotionDetail> getDatatables(FilterData filterData, PromotionDetailForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, PromotionDetail.class);
    }

    @Modifying
    @Query("delete from PromotionDetail u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    void deleteAllByPromotion(Promotion promotion);

    List<PromotionDetail> findAllByPromotion(Promotion promotion);

    default List<PromotionDetailDTO> findByIdPromotion(FilterData filterData, Long idPromotion) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,id_promotion As idPromotion  ";
        nativeSQL += "       ,object_id As objectId     ";
        nativeSQL += "       ,discount_type As discountType ";
        nativeSQL += "       ,promotion_limited As promotionLimited ";
        nativeSQL += "       ,discount As discount ";
        nativeSQL += "       FROM promotion_detail ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND id_promotion = ? ");
        paramList.add(idPromotion);
        return filterData.list(nativeSQL+strCondition.toString(), paramList, PromotionDetailDTO.class);
    }
}
