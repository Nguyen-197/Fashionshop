
package com.portal.core.module.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Comment;
import com.portal.core.module.dto.CommentForm;
import com.portal.core.module.repository.CommentRepository;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class CommentService extends CRUDService<Comment, CommentForm> {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public CRUDDao<Comment, Long> getBaseDao() {
        return commentRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<Comment> getDataTables(CommentForm form) {
        return commentRepository.getDatatables(filterData, form);
    }
}
