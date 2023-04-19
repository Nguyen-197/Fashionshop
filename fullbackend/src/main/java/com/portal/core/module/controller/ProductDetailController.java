
package com.portal.core.module.controller;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.respon.ProductDetailDTO;
import com.portal.core.module.entities.Product;
import com.portal.core.module.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.ProductDetail;
import com.portal.core.module.dto.ProductDetailForm;
import com.portal.core.module.service.ProductDetailService;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/api/v1/product-details")
public class ProductDetailController extends CRUDController<ProductDetail, ProductDetailForm> {

    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductService productService;

    @Override
    protected CRUDService<ProductDetail, ProductDetailForm> getMainService() {
        return productDetailService;
    }

    @Override
    protected Class<ProductDetail> getClassEntity() {
        return ProductDetail.class;
    }
    @GetMapping("/find-detail/{productId}")
    private @ResponseBody Response findAllByProduct(@PathVariable Long productId) {
        try {
            Product product = productService.findById(productId);
            if (product == null) {
                return Response.warning(Constants.RESPONSE_CODE.RECORD_DELETED);
            }
            return Response.success().withData(productDetailService.findAllByProduct(product));
        } catch (Exception e) {
            e.printStackTrace();
            return Response.error(Constants.RESPONSE_CODE.SERVER_ERROR);
        }
    }
    /**
     * API Lấy chi tiết sản phẩm theo size, color
     * @param idProduct
     * @param idSize
     * @param idColor
     * @return
     * @throws ValidateException
     */
    @GetMapping("/find-by-condition")
    public Response findProductDetailByCondition(@RequestParam Long idProduct, @RequestParam Long idSize, @RequestParam Long idColor) throws ValidateException {
        ProductDetailDTO productDetailDTO = productDetailService.findByIdProductByProductAndSizeAndColor(idProduct, idSize, idColor);
//        if(productDetailDTO == null) {
//            return Response.warning(Constants.RESPONSE_CODE.RECORD_DELETED);
//        }
        return Response.success().withData(productDetailDTO);
    }

    /**
     * API lấy chi tiết sản phẩm theo product
     * @param productDetailForm
     * @return
     */
    @GetMapping("/search-details")
    public @ResponseBody Response searchProductDetails (ProductDetailForm productDetailForm) {
        return Response.success().withData(productDetailService.searchProductDetail(productDetailForm));
    }
}
