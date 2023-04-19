package com.portal.core.module.dto.respon;

import lombok.Data;

@Data
public class AddressDTO {

    private Long id;

    private String addressDetail;

    private String addressFull;

    private String district;

    private String province;

    private String ward;

    private String phoneNumber;

    private String fullName;

    private Boolean isDefault;

}
