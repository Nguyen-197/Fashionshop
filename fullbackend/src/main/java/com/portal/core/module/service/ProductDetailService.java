
package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.respon.ProductDetailDTO;
import com.portal.core.module.entities.Color;
import com.portal.core.module.entities.Product;
import com.portal.core.module.entities.Size;
import com.portal.core.module.repository.ColorRepository;
import com.portal.core.module.repository.ProductRepository;
import com.portal.core.module.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.ProductDetail;
import com.portal.core.module.dto.ProductDetailForm;
import com.portal.core.module.repository.ProductDetailRepository;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class ProductDetailService extends CRUDService<ProductDetail, ProductDetailForm> {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public CRUDDao<ProductDetail, Long> getBaseDao() {
        return productDetailRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<ProductDetail> getDataTables(ProductDetailForm form) {
        return productDetailRepository.getDatatables(filterData, form);
    }

    /**
     * search productDetail
     *
     * @param form form
     * @return DataTableResults
     */
    public DataTableResults<ProductDetailDTO> searchProductDetail(ProductDetailForm form) {
        DataTableResults<ProductDetailDTO> datatables =  productDetailRepository.searchProductDetails(filterData, form);
        if (datatables.getData() != null) {
            for (ProductDetailDTO productDetailDTO: datatables.getData()) {
                if (CommonUtils.isNullOrEmpty(productDetailDTO.getImage())) {
                    continue;
                }
            String url = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/file-storage/files/")
                    .path(productDetailDTO.getImage().toString().split(";")[0])
                    .toUriString();
                productDetailDTO.setImage(url);
            }
        }
        return datatables;
    }

    /*
    * Hàm lưu chi tiết sản phẩm
     */

    @Transactional
    public void saveOrUpdateProductDetail(Product product, List<ProductDetailForm> productDetailFormList) throws ValidateException {
        // Lưu danh sách chi tiết sản phẩm
        Map<String, Boolean> mapValueProduct = new HashMap<>();
        if (!CommonUtils.isNullOrEmpty(productDetailFormList)) {
            for (ProductDetailForm item : productDetailFormList) {
                ProductDetail productDetail = new ProductDetail();
                Size size = sizeRepository.findById(item.getIdSize()).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Size không tồn tại"));
                Color color = colorRepository.findById(item.getIdColor()).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Màu không tồn tại"));
                String keyProductDetails = String.format("%s_%s", item.getIdSize(), item.getIdColor());
                if (mapValueProduct.containsKey(keyProductDetails)) {
                    throw new ValidateException(Constants.RESPONSE_CODE.DUPLICATE_CODE, "Sản phẩm đã tồn tại size và color này");
                }
                mapValueProduct.put(keyProductDetails, true);
                productDetail.setColor(color);
                productDetail.setSize(size);
                productDetail.setQuantity(item.getQuantity());
                productDetail.setFinalPrice(item.getFinalPrice());
                productDetail.setCostPrice(item.getCostPrice());
                productDetail.setProduct(product);
                productDetail.setIsDelete(false);
                productDetail.setImage(item.getImage());
                if (CommonUtils.NVL(item.getId()) > 0L) {
                    productDetail.setId(item.getId());
                }
                productDetailRepository.save(productDetail);
            }
        }
    }

    @Override
    protected void customBeforeSave(ProductDetail entity, ProductDetailForm form) throws ValidateException {
        Size size = sizeRepository.findById(form.getIdSize()).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Size không tồn tại"));
        Color color = colorRepository.findById(form.getIdColor()).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Màu không tồn tại"));
        entity.setColor(color);
        entity.setSize(size);
        if(!CommonUtils.isNullOrEmpty(form.getImage())) {
            entity.setImage(form.getImage());
        } else {
            entity.setImage(null);
        }
    }

    public List<ProductDetail> findAllByProduct(Product product) {
        return productDetailRepository.findAllByProduct(product);
    }
    /**
     * Lấy chi tiết sản phẩm theo idproduct, size, color
     * @param idProduct
     * @param idSize
     * @param idColor
     * @return
     * @throws ValidateException
     */
    public ProductDetailDTO findByIdProductByProductAndSizeAndColor(Long idProduct, Long idSize, Long idColor) throws ValidateException {
        List<ProductDetailDTO> productDetail = productDetailRepository.getProductDetailByCondition(filterData, idProduct, idSize, idColor);
        if(!CommonUtils.isNullOrEmpty(productDetail)) {
            ProductDetailDTO productDetailDTO = productDetail.get(0);
            String [] image = productDetailDTO.getImage().toString().split(";");
            List<String> images = new ArrayList<>();
            for (String element: image) {
                String url = ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/file-storage/files/")
                        .path(element)
                        .toUriString();
                images.add(url);
            }
            productDetailDTO.setImage(String.join(";", images));
            return productDetailDTO;
        }
        return null;

    }
}
