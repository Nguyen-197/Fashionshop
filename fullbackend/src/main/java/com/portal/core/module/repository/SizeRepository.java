
package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.SizeForm;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.Size;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface SizeRepository extends CRUDDao<Size, Long> {
    /**
     * List all Size
     */
    public List<Size> findAll();

	/**
     * List all Size paginate
     */
    public Page<Size> findAll(Pageable pageable);

default String buildGetDataQuery(SizeForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,code As code           ";
        nativeSQL += "       ,name As name         ";
        nativeSQL += "       FROM size ";
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
    default DataTableResults<Size> getDatatables(FilterData filterData, SizeForm form) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Size.class);
    }

    @Modifying
    @Query("delete from Size u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    @Query("SELECT s from Size s where  LOWER(s.code) = LOWER(:code) ")
    List<Size> findConflicCode(@Param("code") String code);

    @Query("SELECT s from Size s where s.id <> :id and lower(s.code) = lower(:code) ")
    List<Size> findConflicCode(@Param("id") Long id, @Param("code") String code);

    @Query("SELECT s from Size s where  LOWER(s.name) = LOWER(:name) ")
    List<Size> findConflicName(@Param("name") String name);

    @Query("SELECT s from Size s where s.id <> :id and lower(s.name) = lower(:name) ")
    List<Size> findConflicName(@Param("id") Long id, @Param("name") String name);
}
