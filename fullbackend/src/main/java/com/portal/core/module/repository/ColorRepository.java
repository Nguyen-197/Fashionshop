
package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.ColorForm;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.Color;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface ColorRepository extends CRUDDao<Color, Long> {
    /**
     * List all Color
     */
    public List<Color> findAll();

	/**
     * List all Color paginate
     */
    public Page<Color> findAll(Pageable pageable);

default String buildGetDataQuery(ColorForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,code As code           ";
        nativeSQL += "       ,name As name         ";
        nativeSQL += "       FROM color ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getCode(), strCondition, paramList, "code");
        CommonUtils.filter(form.getName(), strCondition, paramList, "name");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param form
     * @return
     */
    default DataTableResults<Color> getDatatables(FilterData filterData, ColorForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Color.class);
    }

    @Modifying
    @Query("delete from Color u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    @Query("SELECT c from Color c where  LOWER(c.code) = LOWER(:code) ")
    List<Color> findConflicCode(@Param("code") String code);

    @Query("SELECT c from Color c where c.id <> :id and lower(c.code) = lower(:code) ")
    List<Color> findConflicCode(@Param("id") Long id, @Param("code") String code);

    @Query("SELECT c from Color c where  LOWER(c.name) = LOWER(:name) ")
    List<Color> findConflicName(@Param("name") String name);

    @Query("SELECT c from Color c where c.id <> :id and lower(c.name) = lower(:name) ")
    List<Color> findConflicName(@Param("id") Long id, @Param("name") String name);
}
