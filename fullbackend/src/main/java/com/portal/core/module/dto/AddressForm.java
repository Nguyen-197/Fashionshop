package com.portal.core.module.dto;

import lombok.Data;

@Data
public class AddressForm {

    private Long id;

    private String addressDetail;

    private String addressFull;

    private String district;

    private String province;

    private String ward;

    private String phoneNumber;

    private String fullName;

    private Long userId;

    private Boolean isDefault;

}
