
package com.portal.core.module.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.PromotionForm;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.Promotion;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface PromotionRepository extends CRUDDao<Promotion, Long> {
    /**
     * List all Promotion
     */
    public List<Promotion> findAll();

	/**
     * List all Promotion paginate
     */
    public Page<Promotion> findAll(Pageable pageable);

    default String buildGetDataQuery(PromotionForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,code As code         ";
        nativeSQL += "       ,name As name         ";
        nativeSQL += "       ,description As description  ";
        nativeSQL += "       ,promotion_type As promotionType ";
        nativeSQL += "       ,is_active As isActive     ";
        nativeSQL += "       ,start_date As startDate    ";
        nativeSQL += "       ,end_date As endDate      ";
        nativeSQL += "       FROM promotion ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getCode(), strCondition, paramList, "code");
        CommonUtils.filter(form.getName(), strCondition, paramList, "name");
        CommonUtils.filter(form.getDescription(), strCondition, paramList, "description");
        CommonUtils.filter(form.getPromotionType(), strCondition, paramList, "promotion_type");
        CommonUtils.filter(form.getIsActive(), strCondition, paramList, "is_active");
        CommonUtils.filter(form.getStartDate(), strCondition, paramList, "start_date");
        CommonUtils.filter(form.getEndDate(), strCondition, paramList, "end_date");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param PromotionForm sysCatForm
     * @return
     */
    default DataTableResults<Promotion> getDatatables(FilterData filterData, PromotionForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Promotion.class);
    }

    @Modifying
    @Query("delete from Promotion u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    @Modifying
    @Query("UPDATE Promotion SET isActive = :isActive WHERE id = :idPromotion")
    void changeStatusPromotion(@Param("isActive") Integer status, @Param("idPromotion") Long idPromotion);

//    @Query("SELECT p.* FROM Promotion p WHERE p.isActive = 1 AND p.endDate < CURRENT_TIMESTAMP ")
//    List<Long> findPromotionExpired();

    List<Promotion> findAllByIsActiveEqualsAndEndDateLessThan(Integer isActive, Date date);

    List<Promotion> findAllByIsActiveEquals(Integer isActive);

    List<Promotion> findAllByIsActiveEqualsAndEndDateGreaterThanAndStartDateLessThan(Integer isActive, Date endDate, Date startDate);

    @Modifying
    @Query("UPDATE Promotion SET isActive = 2 WHERE id = :idPromotion")
    void updatePromotionExpired(@Param("idPromotion") Long idPromotion);
}
