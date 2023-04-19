package com.portal.core.module.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.DetailReturn;
import com.portal.core.module.dto.DetailReturnForm;
import com.portal.core.module.repository.DetailReturnRepository;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class DetailReturnService extends CRUDService<DetailReturn, DetailReturnForm> {

    @Autowired
    private DetailReturnRepository detailReturnRepository;

    @Override
    public CRUDDao<DetailReturn, Long> getBaseDao() {
        return detailReturnRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<DetailReturn> getDataTables(DetailReturnForm form) {
        return detailReturnRepository.getDatatables(filterData, form);
    }
}
