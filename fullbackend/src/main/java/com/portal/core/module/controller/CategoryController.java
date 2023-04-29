
package com.portal.core.module.controller;

import com.portal.core.common.exception.SysException;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Category;
import com.portal.core.module.dto.CategoryForm;
import com.portal.core.module.service.CategoryService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author yuno_shop
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/category")
public class CategoryController extends CRUDController<Category, CategoryForm> {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private FilterData filterData;

    @Override
    protected CRUDService<Category, CategoryForm> getMainService() {
        return categoryService;
    }

    @Override
    protected Class<Category> getClassEntity() {
        return Category.class;
    }

    @GetMapping("/get-root")
    private Response getRootTreeCategory() {
        try {
            List<Category> lstCategoies = categoryService.findAll();
            List<Category> newListCategories = new ArrayList<>();
            for (Category category : lstCategoies) {
            	if(CommonUtils.NVL(category.getParentId()) <= 0) {
            		List<Category> lstCategoieChild = new ArrayList<>();	
            		for (Category category2 : lstCategoies) {
                    	if(category.getId().equals(category2.getParentId())) {
                    		lstCategoieChild.add(category2);
                    	}
                    }
            		category.setListCategoryChild(lstCategoieChild);
            		newListCategories.add(category);
            	}
            }
            return Response.success().withData(newListCategories);
        } catch (Exception e) {
            e.printStackTrace();
            return  Response.error(Constants.RESPONSE_CODE.SERVER_ERROR).withMessage("network error");
        }
    }
    @GetMapping("/get-root-v2")
    private Response getRootTreeCategoryV2() {
        try {
            List<CategoryForm> lstCategoies = categoryService.getRootCategory(filterData);
            return Response.success().withData(lstCategoies);
        } catch (Exception e) {
            e.printStackTrace();
            return  Response.error(Constants.RESPONSE_CODE.SERVER_ERROR).withMessage("network error");
        }
    }
    
    
    /**
     * findByCode
     *
     * @param code
     * @return
     */
    @GetMapping("/find-by-code/{code}")
    private Response findCategoryByCode(HttpServletRequest request, @PathVariable String code) throws SysException {
    	Category category = categoryService.findByCode(code);
    	if (category == null) {
            return Response.warning(Constants.RESPONSE_CODE.RECORD_DELETED);
        }
        return Response.success().withData(category);
    }
    @GetMapping("/lazy-load-child")
    private Response getLazyLoadTree(HttpServletRequest req, @RequestParam Long parentId) {
        try {
            List<CategoryForm> lstLazyChild = categoryService.getLazyLoadTree(filterData, parentId);
            return Response.success().withData(lstLazyChild);
        } catch (Exception e) {
            e.printStackTrace();
            return  Response.error(Constants.RESPONSE_CODE.SERVER_ERROR).withMessage("network error");
        }
    }
}
