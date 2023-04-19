package com.portal.core.common.result;

import lombok.Data;

import java.util.List;

@Data
public class DataTableResults<T> {

    /**
     *
     */
    List<T> data;

    private String draw;
    private Integer first;

    private Integer recordFiltered;

    private Integer recordTotal;


}
