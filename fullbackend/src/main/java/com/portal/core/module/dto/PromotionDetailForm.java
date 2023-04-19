
package com.portal.core.module.dto;


import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
public class PromotionDetailForm {

    private Long id;
    private Long idPromotion;
    private Long objectId;
    private Integer discountType;
    private Long promotionLimited;
    private Long discount;       // Chiết khấu
}
