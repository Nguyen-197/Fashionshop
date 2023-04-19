
package com.portal.core.module.dto;


import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
public class CategoryForm {

    private Long id;

    @NotBlank(message = "Trường mã danh mục không thể bỏ trống")
    @Size(max = 50, message = "Trường mã danh mục không vượt quá {max}")
    private String code;

    @NotBlank(message = "Trường tên danh mục không thể bỏ trống")
    @Size(max = 200, message = "Trường tên danh mục không vượt quá {max}")
    private String name;

    @Size(max = 2000, message = "Trường mô tả danh mục không vượt quá {max}")
    private String description;

    private Long parentId;
    private String path;
    private Long numberChild;
}
