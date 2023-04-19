
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
import com.portal.core.module.entities.Color;
import com.portal.core.module.dto.ColorForm;
import com.portal.core.module.repository.ColorRepository;

import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class ColorService extends CRUDService<Color, ColorForm> {

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public CRUDDao<Color, Long> getBaseDao() {
        return colorRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<Color> getDataTables(ColorForm form) {
        return colorRepository.getDatatables(filterData, form);
    }

    @Override
    protected void validateBeforeSave(Color entity, ColorForm form) throws ValidateException {
        List<Color> lstDuplicateCode;
        List<Color> lstDuplicateName;
        Long id = CommonUtils.NVL(entity.getId());
        if (id.equals(0L)) {
            lstDuplicateCode = colorRepository.findConflicCode(form.getCode().trim());
            lstDuplicateName = colorRepository.findConflicName(form.getName().trim());
        } else {
            lstDuplicateCode = colorRepository.findConflicCode(form.getId(), form.getCode().trim());
            lstDuplicateName = colorRepository.findConflicName(form.getId(), form.getName().trim());
        }

        if (!CommonUtils.isNullOrEmpty(lstDuplicateCode)) {
            throw new ValidateException(Constants.RESPONSE_CODE.DUPLICATE_CODE, "Mã code đã tồn tại");
        }

        if (!CommonUtils.isNullOrEmpty(lstDuplicateName)) {
            throw new ValidateException(Constants.RESPONSE_CODE.DUPLICATE_CODE, "Tên màu đã tồn tại");
        }
    }

    @Override
    protected void validateBeforeDelete(Color entity) throws ValidateException {
        List<ProductDetail> lstProductDetail = productDetailRepository.findAllByColor(entity);
        if (!CommonUtils.isNullOrEmpty(lstProductDetail)) {
            throw new ValidateException(Constants.RESPONSE_CODE.WARNING, "1 số sản phẩm đang có color " + entity.getName() + ", không thế xoá");
        }
    }
}
