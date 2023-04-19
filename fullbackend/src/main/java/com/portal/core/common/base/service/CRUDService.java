package com.portal.core.common.base.service;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.common.utils.FilterData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import javax.xml.bind.ValidationException;
import java.util.List;

@Service
public abstract class CRUDService<E, F> {
    protected abstract CRUDDao<E, Long> getBaseDao();

    @Autowired
    protected FilterData filterData;

    @Autowired
    HttpServletRequest request;

    /**
     * findById
     *
     * @param id id của bản ghi
     * @return E
     */
    public E findById(Long id) {
        return getBaseDao().findById(id).orElse(null);
    }

    /**
     * findAll
     * @return E
     */
    public List<E> findAll() {
        return getBaseDao().findAll();
    }

    /**
     *
     * @param pageable
     * @throws
     */
    public Page<E> findAllPaginate(Pageable pageable) {
        return getBaseDao().findAll(pageable);
    }

    protected void validateBeforeSave(E entity, F form) throws ValidateException{
    }
    protected void customBeforeSave(E entity, F form) throws ValidateException {}

    protected void customAfterSave(E entity, F form) throws ValidateException {}

    protected void validateBeforeDelete(E entity) throws ValidateException {}

    @Transactional
    public E saveOrUpdate(E entity, F form) throws Exception, ValidateException {
        String columId = CommonUtils.getFieldNameID(entity);
        Object id = CommonUtils.getPropertyValueByFieldName(form, columId);
        if (id != null) {
            E entityExist = this.findById((Long) id);
            if (entityExist == null) {
                throw new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Bản ghi không tồn tại");
            } else {
                entity = entityExist;
            }
        }
        validateBeforeSave(entity, form);
        // copy gia tri vao các trường
        List<String> lstField = CommonUtils.getListFieldName(entity);
        CommonUtils.copyProperties(entity, form, lstField);
        customBeforeSave(entity, form);
        getBaseDao().save(entity);
        customAfterSave(entity, form);
        return entity;
    }

    /**
     * saveOrUpdate
     *
     * @param entity entity
     */
    @Transactional
    public void saveOrUpdateEntity(E entity){
        getBaseDao().save(entity);
    }

    /**
     * Delete
     * @param Entity entity
     *
     */
    @Transactional
    public void delete(E entity) throws ValidateException {
        validateBeforeDelete(entity);
        getBaseDao().delete(entity);
    }


    /**
     * Get datatable
     * @param form
     * @return
     */
    public abstract DataTableResults<E> getDataTables(F form);
}
