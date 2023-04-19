package com.portal.core.common.utils;

import lombok.Data;

@Data
public class SearchParam {

    /**
     * The constant ORDER_BY
     */
    private static final String ORDER_BY = " ORDER BY ";

    /**
     * The Constant SPACE
     */
    private static final String SPACE = " ";

    /**
     * The Constant Sort
     */
    private static final String SORT_ASC = "ASC";
    private static final String SORT_DESC = "DESC";

    /**
     * The Constant BLANK
     */
    private static final String BLANK = "";
    private Integer first;
    private Integer rows;
    private String sortField;
    private Integer sortOrder;

    /**
     * Get the order by clause
     * @return the order by clause
     */
    public String getOrderByClause() {
        StringBuilder sbsb = null;
        if (!CommonUtils.isNullOrEmpty(this.sortField)) {
            String sortStr = (1 == this.sortOrder) ? SORT_DESC : SORT_ASC;
            sbsb = new StringBuilder();
            sbsb.append(ORDER_BY).append(this.sortField).append(SPACE).append(sortStr);
        }
        return (null == sbsb) ? BLANK : sbsb.toString();
    }
}
