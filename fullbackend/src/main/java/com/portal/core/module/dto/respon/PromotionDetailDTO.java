package com.portal.core.module.dto.respon;

import lombok.Data;

@Data
public class PromotionDetailDTO {
    private Long id;
    private Long idPromotion;
    private Long objectId;
    private Integer discountType;
    private Long promotionLimited;
    private Long discount;       // Chiết khấu
    private String objectName;
    private String image;
}
