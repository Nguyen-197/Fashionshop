package com.portal.core.module.service;

import com.portal.core.common.utils.CommonUtils;
import com.portal.core.module.dto.respon.OrderDetailDTO;
import com.portal.core.module.entities.DetailOrders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.dto.DetailOrdersForm;
import com.portal.core.module.repository.DetailOrdersRepository;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class DetailOrdersService extends CRUDService<DetailOrders, DetailOrdersForm> {

    @Autowired
    private DetailOrdersRepository detailOrdersRepository;

    @Override
    public CRUDDao<DetailOrders, Long> getBaseDao() {
        return detailOrdersRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<DetailOrders> getDataTables(DetailOrdersForm form) {
        return detailOrdersRepository.getDatatables(filterData, form);
    }

    public List<OrderDetailDTO> getProductDetailByIdOrder(Long idOrder) {
        try {
            List<OrderDetailDTO> listOrderDetails = detailOrdersRepository.getProductDetailByIdOrder(filterData, idOrder);
            if (!CommonUtils.isNullOrEmpty(listOrderDetails)) {
                for (OrderDetailDTO order : listOrderDetails) {
                    String urlDetail = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(order.getImage().toString().split(";")[0])
                            .toUriString();
                    order.setImage(urlDetail);
                }
            }
            return listOrderDetails;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
