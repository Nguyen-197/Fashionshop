
package com.portal.core.module.repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.portal.core.common.result.DataTableResults;
import javax.transaction.Transactional;
import com.portal.core.common.utils.FilterData;
import org.springframework.data.jpa.repository.Modifying;
import com.portal.core.common.utils.CommonUtils;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.portal.core.common.base.dao.CRUDDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.portal.core.module.dto.CommentForm;
import com.portal.core.module.entities.Comment;


/**
 * @author yuno_shop
 * @version 1.0
 */
@Transactional
@Repository
public interface CommentRepository extends CRUDDao<Comment, Long> {
    /**
     * List all Comment
     */
    public List<Comment> findAll();

	/**
     * List all Comment paginate
     */
    public Page<Comment> findAll(Pageable pageable);

	default String buildGetDataQuery(CommentForm form, List<Object> paramList) {
        String nativeSQL = "SELECT ";
        nativeSQL += "        id As id           ";
        nativeSQL += "       ,id_user As idUser       ";
        nativeSQL += "       ,id_product As idProduct    ";
        nativeSQL += "       ,contents As contents     ";
        nativeSQL += "       ,date As date         ";
        nativeSQL += "       ,id_parent As idParent     ";
        nativeSQL += "       FROM comment ";
        String orderBy = " ORDER BY id DESC";
        StringBuilder strCondition = new StringBuilder(" WHERE 1 = 1 ");
        CommonUtils.filter(form.getId(), strCondition, paramList, "id");
        CommonUtils.filter(form.getIdUser(), strCondition, paramList, "id_user");
        CommonUtils.filter(form.getIdProduct(), strCondition, paramList, "id_product");
        CommonUtils.filter(form.getContents(), strCondition, paramList, "contents");
        CommonUtils.filter(form.getDate(), strCondition, paramList, "date");
        CommonUtils.filter(form.getIdParent(), strCondition, paramList, "id_parent");
        return nativeSQL + strCondition.toString() + orderBy;
    }

    /**
     * get data by datatable
     *
     * @param filterData
     * @param form
     * @return
     */
    default DataTableResults<Comment> getDatatables(FilterData filterData, CommentForm form ) {
        List<Object> paramList = new ArrayList<>();
        String nativeQuery = buildGetDataQuery(form, paramList);
        return filterData.findPaginationQuery(nativeQuery, paramList, Comment.class);
    }

    @Modifying
    @Query("delete from Comment u where u.id in ?1")
    void deleteByIds(List<Long> ids);
}
