
package com.portal.core.module.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
public class PromotionForm {

    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer promotionType;         // Loại khuyến mãi : 1) Khuyến mãi theo danh mục sản phẩm 2) Khuyến mãi theo sản phẩm
    private Integer isActive;
    private Date startDate;
    private Date endDate;
    private List<PromotionDetailForm> listPromotionDetail;
}
