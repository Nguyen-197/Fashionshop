package com.portal.core.module.schedule;

import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.entities.Product;
import com.portal.core.module.entities.ProductDetail;
import com.portal.core.module.entities.Promotion;
import com.portal.core.module.entities.PromotionDetail;
import com.portal.core.module.repository.ProductDetailRepository;
import com.portal.core.module.repository.PromotionDetailRepository;
import com.portal.core.module.repository.PromotionRepository;
import com.portal.core.module.service.ProductService;
import com.portal.core.module.service.PromotionDetailService;
import com.portal.core.module.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class PromotionSchedule {

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PromotionDetailService promotionDetailService;

    @Autowired
    private PromotionDetailRepository promotionDetailRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Scheduled(cron = "${schedule.start.promotion}")
    public void processStartPromotion() {
        stopWorkingPromotion();                 // Dừng tất cả các chương trình khuyến mãi đã hết hạn
        stopWorkingPromotionInActive();         // Dừng tất cả các chương trình khuyến mãi ngừng hoạt động
        startPromotion();                       // Bắt đầu chương trình khuyến mãi

    }

    /**
     * Hàm bắt đầu chương trình khuyến mãi
     */
    private void startPromotion() {
        List<Promotion> lstPromotion = promotionRepository.findAllByIsActiveEqualsAndEndDateGreaterThanAndStartDateLessThan(Constants.PROMOTION_STATUS.ACTIVE, new Date(), new Date()); // Lấy ra tất cả các chương trình khuyến mãi đang hoạt động và còn hiệu lực
        if (CommonUtils.isNullOrEmpty(lstPromotion)) {
            return;
        }
        for (Promotion promotion: lstPromotion) {
            List<PromotionDetail> lstPromotionDetail = promotionDetailRepository.findAllByPromotion(promotion);      // Lấy tất cả chi tiết khuyến mãi theo chương trình khuyến mãi
            if (CommonUtils.isNullOrEmpty(lstPromotionDetail)) {
                return;
            }
            startSaleOffProduct(promotion.getPromotionType(), lstPromotionDetail);
        }
    }

    /**
     * Hàm bắt đầu sale sản phẩm
     * @param promotionType
     * @param lstPromotionDetail
     */
    private void startSaleOffProduct(Integer promotionType, List<PromotionDetail> lstPromotionDetail) {
        List<ProductDetail> lstProductDetailSaleOff = new ArrayList<>();
        for (PromotionDetail item: lstPromotionDetail) {
            if (promotionType.equals(Constants.PROMOTION_TYPE.IN_CATEGORY)) {
                lstProductDetailSaleOff = productDetailRepository.findAllProductNotSaleOfByCategory(item.getObjectId());           // Lấy ra những sản phẩn theo danh mục chưa được sale
            } else {
                lstProductDetailSaleOff = productDetailRepository.findAllProductNotSaleOfByProduct(item.getObjectId());            // Lấy ra những sản phẩn chưa được sale
            }
            if (CommonUtils.isNullOrEmpty(lstProductDetailSaleOff)) {
                return;
            }
            for (ProductDetail productDetail: lstProductDetailSaleOff) {
                if (item.getDiscountType().equals(Constants.DISCOUNT_TYPE.IN_VALUE)) {      // TH giảm theo giá trị
                    Long discountPrice = item.getDiscount() > item.getPromotionLimited() ? item.getPromotionLimited() : item.getDiscount();
                    BigDecimal salePriceAffter;
                    if (productDetail.getFinalPrice().compareTo(BigDecimal.valueOf(discountPrice)) < 0) { // TH giá giảm > giá bán
                        salePriceAffter = new BigDecimal(0);    // giá sale = 0
                    } else {
                        salePriceAffter = productDetail.getFinalPrice().subtract(BigDecimal.valueOf(discountPrice));  // Giá sale = giá bán - giá giảm
                    }
                    productDetailRepository.startSaleOffProduct(salePriceAffter, productDetail.getId());            // Sale sản phẩm
                } else {                                                                     // TH giảm theo %
                    Long discountPrice = productDetail.getFinalPrice().multiply(BigDecimal.valueOf(item.getDiscount())).divide(new BigDecimal(100)).longValue();
                    discountPrice = discountPrice > item.getPromotionLimited() ? item.getPromotionLimited() : discountPrice;
                    BigDecimal salePriceAffter;
                    if (productDetail.getFinalPrice().compareTo(BigDecimal.valueOf(discountPrice)) < 0) { // TH giá giảm > giá bán
                        salePriceAffter = new BigDecimal(0);    // giá sale = 0
                    } else {
                        salePriceAffter = productDetail.getFinalPrice().subtract(BigDecimal.valueOf(discountPrice));  // Giá sale = giá bán - giá giảm
                    }
                    productDetailRepository.startSaleOffProduct(salePriceAffter, productDetail.getId());            // Sale sản phẩm
                }
            }
        }
    }

    /**
     * Hàm ngừng chương trình khuyến mãi
     */
    private void stopWorkingPromotion() {
       List<Promotion> lstPromotion = promotionRepository.findAllByIsActiveEqualsAndEndDateLessThan(Constants.PROMOTION_STATUS.ACTIVE, new Date());  // Lấy ra tất cả chương trình khuyến mãi ngừng hoạt động
       if (!CommonUtils.isNullOrEmpty(lstPromotion)) {
           for (Promotion promotion: lstPromotion) {
               promotionRepository.updatePromotionExpired(promotion.getId()); // Ngừng hoạt động chương trình khuyến mãi
               List<PromotionDetail> lstPromotionDetail = promotionDetailRepository.findAllByPromotion(promotion);      // Lấy tất cả chi tiết khuyến mãi theo chương trình khuyến mãi
               if (CommonUtils.isNullOrEmpty(lstPromotionDetail)) {
                   return;
               }
               stopSaleOffProduct(promotion.getPromotionType(), lstPromotionDetail);            // Ngừng sale sản phẩm
           }
       }
    }

    /**
     * Hàm ngừng sale sản phẩm với những CT KM đã ngừng hoạt động
     */
    private void stopWorkingPromotionInActive() {
        List<Promotion> lstPromotion = promotionRepository.findAllByIsActiveEquals(Constants.PROMOTION_STATUS.INACTIVE);  // Lấy ra tất cả chương trình khuyến mãi ngừng hoạt động
        if (!CommonUtils.isNullOrEmpty(lstPromotion)) {
            for (Promotion promotion: lstPromotion) {
                List<PromotionDetail> lstPromotionDetail = promotionDetailRepository.findAllByPromotion(promotion);      // Lấy tất cả chi tiết khuyến mãi theo chương trình khuyến mãi
                if (CommonUtils.isNullOrEmpty(lstPromotionDetail)) {
                    return;
                }
                stopSaleOffProduct(promotion.getPromotionType(), lstPromotionDetail);            // Ngừng sale sản phẩm
            }
        }
    }

    /**
     * Hàm ngừng sale sản phẩm
     * @param promotionType
     * @param lstPromotionDetail
     */
    private void stopSaleOffProduct(Integer promotionType, List<PromotionDetail> lstPromotionDetail) {
        List<Long> lstProductDetailSaleOff = new ArrayList<>();
        for (PromotionDetail item: lstPromotionDetail) {
            if (promotionType.equals(Constants.PROMOTION_TYPE.IN_CATEGORY)) {
                lstProductDetailSaleOff = productDetailRepository.findAllProductSaleOfByCategory(item.getObjectId());           // Lấy ra những sản phẩn còn sale theo danh mục
            } else {
                lstProductDetailSaleOff = productDetailRepository.findAllProductSaleOfByProduct(item.getObjectId());            // Lấy ra những sản phẩn còn sale
            }
            if (!CommonUtils.isNullOrEmpty(lstProductDetailSaleOff)) {
                for (Long idPdt: lstProductDetailSaleOff) {
                    productDetailRepository.stopSaleOffProduct(idPdt);  // Ngừng sale sản phẩm
                }
            }
        }
    }
}
