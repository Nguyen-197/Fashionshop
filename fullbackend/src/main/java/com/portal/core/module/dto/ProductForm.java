
package com.portal.core.module.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
public class ProductForm {

    private Long id;

    @NotBlank(message = "Trường mã sản phẩm không thể bỏ trống")
    @Size(max = 50, message = "Trường danh mục không vượt quá {max}")
    private String code;

    @NotBlank(message = "Trường tên sản phẩm không thể bỏ trống")
    @Size(max = 200, message = "Trường tên sản phẩm không vượt quá {max}")
    private String name;

    @Size(max = 5000, message = "Trường mô tả sản phẩm không vượt quá {max}")
    private String description;

    private Boolean isDelete;

    @NotNull(message = "Trường danh mục không thể bỏ trống")
    private Long idCategory;

    @NotNull(message = "Trường khối lượng không thể bỏ trống")
    private Integer mass;

    private String image;

    private Integer productGender;

    private List<ProductDetailForm> listProductDetail;

    private List<Long> listProductGender;
    private List<String> listProductCategory;
    private List<String> listProductSize;
    private List<String> listProductColor;
}
