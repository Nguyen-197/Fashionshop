
package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.PromotionDetailForm;
import com.portal.core.module.dto.respon.PromotionDTO;
import com.portal.core.module.dto.respon.PromotionDetailDTO;
import com.portal.core.module.entities.Category;
import com.portal.core.module.entities.Product;
import com.portal.core.module.entities.PromotionDetail;
import com.portal.core.module.repository.PromotionDetailRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Promotion;
import com.portal.core.module.dto.PromotionForm;
import com.portal.core.module.repository.PromotionRepository;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Date;
import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class PromotionService extends CRUDService<Promotion, PromotionForm> {

    @Autowired
    private PromotionRepository promotionRepository;

    @Override
    public CRUDDao<Promotion, Long> getBaseDao() {
        return promotionRepository;
    }

    @Autowired
    private PromotionDetailService promotionDetailService;

    @Autowired
    private PromotionDetailRepository promotionDetailRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<Promotion> getDataTables(PromotionForm form) {
        return promotionRepository.getDatatables(filterData, form);
    }


    @Override
    protected void validateBeforeSave(Promotion entity, PromotionForm form) throws ValidateException {
        if (form.getEndDate().compareTo(new Date()) < 0) {
            throw new ValidateException("date.invalid", "Ngày kết thúc phải lớn hơn ngày hiện tại");
        }
    }

    @Override
    protected void customBeforeSave(Promotion entity, PromotionForm form) throws ValidateException {
        entity.setIsActive(Constants.PROMOTION_STATUS.ACTIVE);
    }

    @Override
    protected void customAfterSave(Promotion entity, PromotionForm form) throws ValidateException {
        String promotionCode = String.format("KM" + "%03d", entity.getId());
        entity.setCode(promotionCode);
        if (!CommonUtils.isNullOrEmpty(form.getListPromotionDetail())) {
            promotionDetailService.savePromotionDetail(entity, form.getListPromotionDetail());
        }
    }

    public Response changeStatusPromotion(Integer status, Long idPromotion) {
        try {
            promotionRepository.changeStatusPromotion(status, idPromotion);
            return Response.success(Constants.RESPONSE_CODE.ACTION_SUCCESS);
        } catch (Exception e) {
            e.printStackTrace();
            return Response.error(Constants.RESPONSE_CODE.ACTION_ERROR);
        }
    }

    public PromotionDTO findByIdPromotion(Long id) throws ValidateException {
        PromotionDTO promotionDTO = new PromotionDTO();
        Promotion promotion = promotionRepository.findById(id).orElseThrow(() -> new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Chương trình không tồn tại"));
        BeanUtils.copyProperties(promotion, promotionDTO);
        List<PromotionDetailDTO> lstPromotion = promotionDetailRepository.findByIdPromotion(filterData, promotion.getId());
        if (!CommonUtils.isNullOrEmpty(lstPromotion)) {
            for (PromotionDetailDTO promotionDetail : lstPromotion) {
                if (promotion.getPromotionType().equals(Constants.PROMOTION_TYPE.IN_CATEGORY)) {
                    Category category = categoryService.findById(promotionDetail.getObjectId());
                    if (category != null) {
                        promotionDetail.setObjectName(category.getName());
                    }
                } else {
                    Product product = productService.findById(promotionDetail.getObjectId());
                    if (product != null) {
                        promotionDetail.setObjectName(product.getName());
                        String urlDetail = ServletUriComponentsBuilder
                                .fromCurrentContextPath()
                                .path("/api/file-storage/files/")
                                .path(product.getImage().toString().split(";")[0])
                                .toUriString();
                        promotionDetail.setImage(urlDetail);
                    }
                }
            }
        }
        promotionDTO.setListPromotionDetail(lstPromotion);
        return promotionDTO;
    }
}
