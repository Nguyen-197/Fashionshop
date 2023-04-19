
package com.portal.core.module.dto;

import java.math.BigDecimal;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
public class ProductDetailForm {

    private Long id;

    @NotNull(message = "Trường size không thể bỏ trống")
    private Long idSize;

    @NotNull(message = "Trường màu không thể bỏ trống")
    private Long idColor;

    @NotNull(message = "Trường số lượng không thể bỏ trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;

    @NotNull(message = "Trường giá nhập không thể bỏ trống")
    @Min(value = 1, message = "Giá nhập phải lớn hơn 0")
    private BigDecimal costPrice;

    private BigDecimal salePrice;

    @NotNull(message = "Trường giá bán không thể bỏ trống")
    @Min(value = 1, message = "Giá bán phải lớn hơn 0")
    private BigDecimal finalPrice;

    @NotNull(message = "Trường sản phẩm không thể bỏ trống")
    private Long idProduct;

    private String image;

    private Boolean isDelete;

    private String sizeName;

    private String colorName;
}
