
package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.entities.Product;
import com.portal.core.module.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Category;
import com.portal.core.module.dto.CategoryForm;
import com.portal.core.module.repository.CategoryRepository;

import java.util.ArrayList;
import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class CategoryService extends CRUDService<Category, CategoryForm> {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    protected CRUDDao<Category, Long> getBaseDao() {
        return categoryRepository;
    }

    @Override
    protected void validateBeforeSave(Category entity, CategoryForm form) throws ValidateException {
        List<Category> lstDuplicateCode;
        Long id = CommonUtils.NVL(entity.getId());
        if (id.equals(0L)) {
            lstDuplicateCode = categoryRepository.findConflicCode(form.getCode().trim());
        } else {
            lstDuplicateCode = categoryRepository.findConflicCode(form.getId(), form.getCode().trim());
        }

        if (!CommonUtils.isNullOrEmpty(lstDuplicateCode)) {
            throw new ValidateException(Constants.RESPONSE_CODE.DUPLICATE_CODE, "Mã code đã tồn tại");
        }
        if (id> 0L) {
            Category category = this.findById(id);
            Category categoryParent = this.findById(CommonUtils.NVL(form.getParentId()));
            if (category != null) {
                form.setPath(category.getPath());
            }
            // check phạm vi di chuyển danh mục khi update
            if (categoryParent != null) {
                if (categoryParent.getParentId() != null) {
                    throw new ValidateException(Constants.RESPONSE_CODE.CANNOT_CHOOSE_CATEGORY_PARENT, "Danh mục chỉ tối đa 2 cấp");
                }
                List<Category> listChildCategory = categoryRepository.getListChildByPath(category.getPath());
                if (listChildCategory.size() > 1) {
                    throw new ValidateException(Constants.RESPONSE_CODE.CANNOT_CHOOSE_CATEGORY_PARENT, "Danh mục hiện tại đang có danh mục con, không thể di chuyển");
                }
                if (!checkScopeUpdate(category, categoryParent)) {
                    throw new ValidateException(Constants.RESPONSE_CODE.CANNOT_CHOOSE_CATEGORY_PARENT, "Danh mục cha không hợp lệ");
                }
            }
        } else {
            Category categoryParent = this.findById(CommonUtils.NVL(form.getParentId()));
            if (categoryParent != null && categoryParent.getParentId() != null) {
                throw new ValidateException(Constants.RESPONSE_CODE.CANNOT_CHOOSE_CATEGORY_PARENT, "Danh mục chỉ tối đa 2 cấp");
            }
        }
    }

    @Override
    protected void customAfterSave(Category entity, CategoryForm form) throws ValidateException {
        Category categoryUpdate;
        Long id = CommonUtils.NVL(form.getId());
        if (id > 0L) {
            categoryUpdate = this.findById(id);
            List<Category> listChildCategory = categoryRepository.getListChildByPath(categoryUpdate.getPath());
            if (!CommonUtils.isNullOrEmpty(listChildCategory)) {
                listChildCategory.stream().forEach(category -> {
                    String path = buildPathCategory(CommonUtils.NVL(category.getParentId()), category.getId());
                    category.setPath(path);
                });
            }
        } else {
            String path = buildPathCategory(CommonUtils.NVL(form.getParentId()), entity.getId());
            entity.setPath(path);
        }
    }

    /**
     * Hàm buid path danh mục
     * @param idParent: danh mục cha, idCategory: danh mục con
     */
    public String buildPathCategory(Long idParent, Long idCategory) {
        String path = "";
        Category category = categoryRepository.findById(idParent).orElse(null);
        if (category != null && !idParent.equals(idCategory)) {
            path = category.getPath() + idCategory + "/";
        } else {
            path = "/" + idCategory + "/";
        }
        return path;
    }
    /**
     * Hàm lấy danh sách danh mục cha
     * @param *
     */
    public List<CategoryForm> getRootCategory(FilterData filterData) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += "        id As id           ";
        sql += "       , name As name         ";
        sql += "       , parent_id As parentId  ";
        sql += "       , path As path  ";
        sql += "       , code As code  ";
        sql += "       , (select count(*) from category c2 where c2.parent_id = c1.id ) As numberChild ";
        sql += "       FROM category c1 where (c1.parent_id = 0 OR c1.parent_id IS NULL) ORDER BY c1.id DESC";
        return filterData.list(sql, paramList, CategoryForm.class);
    }

    /**
     * Hàm lazy danh mục con theo parentId
     *@param parentId: danh mục cha
     */
    public List<CategoryForm> getLazyLoadTree(FilterData filterData, Long parentId) {
        List<Object> paramList = new ArrayList<>();
        String sql = " SELECT ";
        sql += "        id As id           ";
        sql += "       , name As name         ";
        sql += "       , parent_id As parentId  ";
        sql += "       , path As path  ";
        sql += "       , code As code  ";
        sql += "       , (select count(*) from category c2 where c2.parent_id = c1.id ) As numberChild ";
        sql += "       FROM category c1 where c1.parent_id = ? ORDER BY c1.id DESC";
        paramList.add(parentId);
        return filterData.list(sql, paramList, CategoryForm.class);
    }
    @Override
    public DataTableResults<Category> getDataTables(CategoryForm form) {
        return categoryRepository.getDatatables(filterData, form);
    }
    public Category findByCode(String code) {
    	return categoryRepository.findByCode(code);
    }
    private Boolean checkScopeUpdate(Category category, Category categoryParent) {
        if (category.getId().equals(categoryParent.getId())) {
            return false;
        }
        List<Category> listChildCategory = categoryRepository.getListChildByPath(category.getPath());
        if (!CommonUtils.isNullOrEmpty(listChildCategory)) {
            for (Category item: listChildCategory) {
                if (categoryParent.getParentId() != null) {
                    if(categoryParent.getParentId().equals(item.getId())) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    @Override
    protected void validateBeforeDelete(Category entity) throws ValidateException {
        List<Product> lstProduct = productRepository.findAllByCategory(entity);
        if (!CommonUtils.isNullOrEmpty(lstProduct)) {
            throw new ValidateException(Constants.RESPONSE_CODE.WARNING, "Không thể xoá danh mục đang có sản phẩm");
        }
        List<Category> listChildCategory = categoryRepository.getListChildByPath(entity.getPath());
        if (listChildCategory.size() > 1) {
            throw new ValidateException(Constants.RESPONSE_CODE.WARNING, "Không thể xoá danh mục đang có danh mục con");
        }
    }
}
