package com.portal.core.module.dto.respon;

import com.portal.core.module.dto.PromotionDetailForm;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class PromotionDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer promotionType;         // Loại khuyến mãi : 1) Khuyến mãi theo danh mục sản phẩm 2) Khuyến mãi theo sản phẩm
    private Integer isActive;
    private Date startDate;
    private Date endDate;
    private List<PromotionDetailDTO> listPromotionDetail;
}
