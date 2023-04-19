package com.portal.core.module.dto;

import lombok.Data;

@Data
public class BillRespon {

    private String productName;
    private Long idProductDetail;
    private String sizeName;
    private String colorName;
    private Long quantity;
    private Long price;

}
