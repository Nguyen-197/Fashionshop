
package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.respon.CartDTO;
import com.portal.core.module.dto.respon.FavoriesDTO;
import com.portal.core.module.entities.Product;
import com.portal.core.module.entities.User;
import com.portal.core.module.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Favories;
import com.portal.core.module.dto.FavoriesForm;
import com.portal.core.module.repository.FavoriesRepository;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class FavoriesService extends CRUDService<Favories, FavoriesForm> {

    @Autowired
    private FavoriesRepository favoriesRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public CRUDDao<Favories, Long> getBaseDao() {
        return favoriesRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<Favories> getDataTables(FavoriesForm form) {
        return favoriesRepository.getDatatables(filterData, form);
    }

    @Override
    protected void customBeforeSave(Favories entity, FavoriesForm form) throws ValidateException {
        try {
            User user = userService.getInfomationUser();
            if (user != null) {
                entity.setUser(user);
            }
            Product product = productRepository.findById(CommonUtils.NVL(form.getIdProduct())).orElseThrow(() -> new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Sản phẩm không tồn tại"));
            entity.setProduct(product);
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    public DataTableResults<FavoriesDTO> findAllByUser(User user) {
        if (user != null) {
            DataTableResults<FavoriesDTO> listFaroviesDto = favoriesRepository.getFavoriesByUserLogin(filterData, user.getId());
            if (!CommonUtils.isNullOrEmpty(listFaroviesDto.getData()))
                for (FavoriesDTO favoriesDTO: listFaroviesDto.getData()) {
                    String [] image = favoriesDTO.getImage().toString().split(";");
                    List<String> images = new ArrayList<>();
                    for (String element: image) {
                        String url = ServletUriComponentsBuilder
                                .fromCurrentContextPath()
                                .path("/api/file-storage/files/")
                                .path(element)
                                .toUriString();
                        images.add(url);
                    }
                    favoriesDTO.setImage(String.join(";", images));
                }
            return listFaroviesDto;
        }
        return null;
    }
}
