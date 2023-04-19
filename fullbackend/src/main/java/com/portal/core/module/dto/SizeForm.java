
package com.portal.core.module.dto;


import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
public class SizeForm {

    private Long id;

    @NotBlank(message = "Trường mã kích cỡ không thể bỏ trống")
    @Size(max = 50, message = "Trường mã kích cỡ không vượt quá {max}")
    private String code;

    @NotBlank(message = "Trường tên màu sắc không thể bỏ trống")
    @Size(max = 200, message = "Trường tên kích cỡ không vượt quá {max}")
    private String name;
}
