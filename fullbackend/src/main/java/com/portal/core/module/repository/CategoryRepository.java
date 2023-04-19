
package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.CategoryForm;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.entities.Category;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface CategoryRepository extends CRUDDao<Category, Long> {

    /**
     * get data by datatable
     * @return
     */
    default String buildGetDataQuery(CategoryForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        c1.id As id           ";
        nativeSQL += "       ,c1.name As name         ";
        nativeSQL += "       ,c1.parent_id As parentId     ";
        nativeSQL += "       ,(SELECT c2.name FROM category c2  ";
        nativeSQL += "       WHERE c1.parent_id = c2.id) As parentName      ";
        nativeSQL += "       ,c1.path As path         ";
        nativeSQL += "       ,c1.code As code         ";
        nativeSQL += "       ,c1.description As description  ";
        nativeSQL += "       FROM category c1 ";
        String orderBy = " ORDER BY c1.id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "c1.id");
        CommonUtils.filter(form.getName(), strCondition, paramList, "c1.name");
        CommonUtils.filter(form.getParentId(), strCondition, paramList, "c1.parent_id");
        CommonUtils.filter(form.getPath(), strCondition, paramList, "c1.path");
        CommonUtils.filter(form.getCode(), strCondition, paramList, "c1.code");
        CommonUtils.filter(form.getDescription(), strCondition, paramList, "c1.description");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData       dfData
     * @param form sysCatForm
     * @return
     */
    default DataTableResults<Category> getDatatables(
            FilterData filterData,
            CategoryForm form
    ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Category.class);
    }

    /**
     * List all Category
     */
    public List<Category> findAll();

	/**
     * List all Category paginate
     */
    public Page<Category> findAll(Pageable pageable);

    @Modifying
    @Query("delete from Category u where u.id in ?1")
    void deleteByIds(List<Long> ids);

    @Query("SELECT c from Category c where  LOWER(c.code) = LOWER(:code) ")
    List<Category> findConflicCode(@Param("code") String code);

    @Query("SELECT c from Category c where c.id <> :id and lower(c.code) = lower(:code) ")
    List<Category> findConflicCode(@Param("id") Long id, @Param("code") String code);


    /*
    * lấy danh sách danh mục con
     */
    @Query("select c from Category c where c.path like concat(:path, '%')")
    List<Category> getListChildByPath(String path);
}
