
package com.portal.core.module.service;

import com.portal.core.module.entities.Promotion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.PromotionDetail;
import com.portal.core.module.dto.PromotionDetailForm;
import com.portal.core.module.repository.PromotionDetailRepository;

import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class PromotionDetailService extends CRUDService<PromotionDetail, PromotionDetailForm> {

    @Autowired
    private PromotionDetailRepository promotionDetailRepository;

    @Override
    public CRUDDao<PromotionDetail, Long> getBaseDao() {
        return promotionDetailRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<PromotionDetail> getDataTables(PromotionDetailForm form) {
        return promotionDetailRepository.getDatatables(filterData, form);
    }

    /**
     * Hàm lưu danh sách chi tiết khuyến mãi
     * @param promotion
     * @param lstPromotionForm
     */
    public void savePromotionDetail(Promotion promotion, List<PromotionDetailForm> lstPromotionForm) {
        promotionDetailRepository.deleteAllByPromotion(promotion);      // xoá các chi tiết khuyến mại cũ
        for (PromotionDetailForm item : lstPromotionForm) {
            PromotionDetail promotionDetail = new PromotionDetail();
            promotionDetail.setPromotion(promotion);
            promotionDetail.setObjectId(item.getObjectId());
            promotionDetail.setDiscountType(item.getDiscountType());
            promotionDetail.setPromotionLimited(item.getPromotionLimited());
            promotionDetail.setDiscount(item.getDiscount());
            promotionDetailRepository.save(promotionDetail);
        }
    }
}
