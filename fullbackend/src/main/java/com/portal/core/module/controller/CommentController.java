
package com.portal.core.module.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Comment;
import com.portal.core.module.dto.CommentForm;
import com.portal.core.module.service.CommentService;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/v1/comment")
public class CommentController extends CRUDController<Comment, CommentForm> {

    @Autowired
    private CommentService commentService;

    @Override
    protected CRUDService<Comment, CommentForm> getMainService() {
        return commentService;
    }

    @Override
    protected Class<Comment> getClassEntity() {
        return Comment.class;
    }
}
