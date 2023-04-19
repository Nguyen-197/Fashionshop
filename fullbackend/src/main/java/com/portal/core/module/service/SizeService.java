
package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.entities.ProductDetail;
import com.portal.core.module.repository.ProductDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Size;
import com.portal.core.module.dto.SizeForm;
import com.portal.core.module.repository.SizeRepository;

import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class SizeService extends CRUDService<Size, SizeForm> {

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public CRUDDao<Size, Long> getBaseDao() {
        return sizeRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<Size> getDataTables(SizeForm form) {
        return sizeRepository.getDatatables(filterData, form);
    }

    @Override
    protected void validateBeforeSave(Size entity, SizeForm form) throws ValidateException {
        List<Size> lstDuplicateCode;
        List<Size> lstDuplicateName;
        Long id = CommonUtils.NVL(entity.getId());
        if (id.equals(0L)) {
            lstDuplicateCode = sizeRepository.findConflicCode(form.getCode().trim());
            lstDuplicateName = sizeRepository.findConflicName(form.getName().trim());
        } else {
            lstDuplicateCode = sizeRepository.findConflicCode(form.getId(), form.getCode().trim());
            lstDuplicateName = sizeRepository.findConflicName(form.getId(), form.getName().trim());
        }

        if (!CommonUtils.isNullOrEmpty(lstDuplicateCode)) {
            throw new ValidateException(Constants.RESPONSE_CODE.DUPLICATE_CODE, "Mã code đã tồn tại");
        }

        if (!CommonUtils.isNullOrEmpty(lstDuplicateName)) {
            throw new ValidateException(Constants.RESPONSE_CODE.DUPLICATE_CODE, "Tên size đã tồn tại");
        }
    }

    @Override
    protected void validateBeforeDelete(Size entity) throws ValidateException {
        List<ProductDetail> lstProductDetail = productDetailRepository.findAllBySize(entity);
        if(!CommonUtils.isNullOrEmpty(lstProductDetail)) {
            throw new ValidateException(Constants.RESPONSE_CODE.WARNING, "1 số sản phẩm đang có size " + entity.getName() + ", không thế xoá");
        }
    }
}
