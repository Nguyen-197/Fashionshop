
package com.portal.core.module.dto;

import java.util.Date;

import lombok.Data;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Data
public class CommentForm {

    private Long id;
    private Long idUser;
    private Long idProduct;
    private String contents;
    private Date date;
    private Long idParent;
}
