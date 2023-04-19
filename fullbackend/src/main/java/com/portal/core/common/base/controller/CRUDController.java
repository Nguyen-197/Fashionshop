package com.portal.core.common.base.controller;

import com.portal.core.common.base.service.CRUDService;
import com.portal.core.common.exception.SysException;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin("*")
@RestController
public abstract class CRUDController<E, F> extends BaseController {
    /**
     * Cài đặt main service cho controller để xử lý các action common
     * @return
     */
    protected abstract CRUDService<E, F> getMainService();

    protected abstract Class<E> getClassEntity();

    /**
     * Find all
     *
     */

    @GetMapping(path = "/find-all")
    public Response findAll(HttpServletRequest request) throws SysException {
        List<E> lstEntity = getMainService().findAll();
        return Response.success().withData(lstEntity);
    }

    /**
     * Find all pagination list
     *
     */

    @GetMapping(path = "/paginate")
    public Response findAllPaginate(HttpServletRequest request, Pageable pageable) throws SysException {
        Page<E> lstEntity = getMainService().findAllPaginate(pageable);
        return Response.success().withData(lstEntity);
    }

    /**
     * findById
     *
     * @param id
     * @return
     */
    @GetMapping(path = "/{id}")
    public Response findById(HttpServletRequest request, @PathVariable Long id) throws SysException {
        E entity = getMainService().findById(id);
        if (entity == null) {
            return Response.warning(Constants.RESPONSE_CODE.RECORD_DELETED);
        }
        return Response.success().withData(entity);
    }

    /**
     * saveOrUpdate
     *
     * @param request
     * @param form
     * @return
     * @throws Exception
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response saveOrUpdate(HttpServletRequest request, @RequestBody @Valid F form) throws SysException, Exception {
        E entity = getMainService().saveOrUpdate(getClassEntity().newInstance(), form);
        String columId = CommonUtils.getFieldNameID(entity);
        Object id = CommonUtils.getPropertyValueByFieldName(form, columId);
        String codeSuccess = "";
        if (CommonUtils.isEmpty(id)) {
            codeSuccess = Constants.RESPONSE_CODE.CREATE_SUCCESS;
        } else {
            codeSuccess = Constants.RESPONSE_CODE.UPDATE_SUCCESS;
        }
        return Response.success(codeSuccess).withData(entity);
    }

    /**
     * delete
     *
     * @param id
     * @return
     */

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response delete(HttpServletRequest request, @PathVariable Long id) throws SysException {
        E entity;
        if (id > 0L) {
            entity = getMainService().findById(id);
            if (entity == null) {
                throw new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Bản ghi không tồn tại");
            }
            getMainService().delete(entity);
            return Response.success(Constants.RESPONSE_CODE.DELETE_SUCCESS);
        } else {
            return Response.error(Constants.RESPONSE_CODE.ERROR);
        }
    }

    @GetMapping(path = "/search")
    public Response processSearch(HttpServletRequest request, F form) throws SysException {
        return Response.success().withData(getMainService().getDataTables(form));
    }
}
