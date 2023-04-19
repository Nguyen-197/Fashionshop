
package com.portal.core.module.dto;


import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
public class FavoriesForm {

    private Long id;

    @NotNull(message = "Trường sản phẩm không thể bỏ trống")
    private Long idProduct;
}
