package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.DetailReturnForm;
import com.portal.core.module.dto.respon.DetailReturnDTO;
import com.portal.core.module.entities.Return;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.DetailReturn;



@Transactional
@Repository
public interface DetailReturnRepository extends CRUDDao<DetailReturn, Long> {
    /**
     * List all DetailReturn
     */
    public List<DetailReturn> findAll();

	/**
     * List all DetailReturn paginate
     */
    public Page<DetailReturn> findAll(Pageable pageable);

default String buildGetDataQuery(DetailReturnForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,price As price        ";
        nativeSQL += "       ,quantity As quantity     ";
        nativeSQL += "       FROM detail_return ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getPrice(), strCondition, paramList, "price");
        CommonUtils.filter(form.getQuantity(), strCondition, paramList, "quantity");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    default DataTableResults<DetailReturn> getDatatables(FilterData filterData, DetailReturnForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, DetailReturn.class);
    }

    @Modifying
    @Query("delete from DetailReturn u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    void deleteAllByReturns(Return Returns);

    default List<DetailReturnDTO> getListDetailReturn(FilterData filterData, Long idReturn) {
        List<Object> paramList = new ArrayList<>();
        String nativeSQL = " SELECT ";
        nativeSQL += "        dr.id as id,   ";
        nativeSQL += "        dr.quantity as quantity,   ";
        nativeSQL += "        dr.price as price,         ";
        nativeSQL += "        p.`code` as productCode,         ";
        nativeSQL += "        p.`name` as productName,   ";
        nativeSQL += "        s.`name` as sizeName,  ";
        nativeSQL += "        c.`name` as colorName,          ";
        nativeSQL += "        dr.returns_id as returnId,    ";
        nativeSQL += "        pd.image as image       ";
        nativeSQL += "       FROM detail_return dr ";
        nativeSQL += "       JOIN detail_orders odt ON odt.id = dr.order_detail_id ";
        nativeSQL += "       JOIN product_detail pd ON pd.id = odt.product_detail_id ";
        nativeSQL += "       JOIN product p ON p.id = pd.id_product ";
        nativeSQL += "       JOIN size s on pd.id_size = s.id ";
        nativeSQL += "       JOIN color c on pd.id_color = c.id ";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        strCondition.append(" AND dr.returns_id = ? ");
        paramList.add(idReturn);
        String orderBy = " ORDER BY dr.id DESC ";
        String groupBy= " GROUP BY dr.id ";
        return filterData.list(nativeSQL + strCondition + groupBy + orderBy, paramList, DetailReturnDTO.class);
    }

    List<DetailReturn> findAllByReturns(Return returns);
}
