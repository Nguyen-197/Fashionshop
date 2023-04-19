
package com.portal.core.module.controller;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Product;
import com.portal.core.module.dto.ProductForm;
import com.portal.core.module.service.ProductService;

import javax.servlet.http.HttpServletRequest;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/api/v1/product")
public class ProductController extends CRUDController<Product, ProductForm> {

    @Autowired
    private ProductService productService;

    @Override
    protected CRUDService<Product, ProductForm> getMainService() {
        return productService;
    }

    @Override
    protected Class<Product> getClassEntity() {
        return Product.class;
    }

    @PostMapping
    public Response saveOrUpdate(HttpServletRequest request, ProductForm form) throws Exception, ValidateException {
        Product product = productService.saveOrUpdate(getClassEntity().newInstance(), form);
        String codeSuccess = "";
        if (CommonUtils.NVL(form.getId()).equals(0L)) {
            codeSuccess = Constants.RESPONSE_CODE.CREATE_SUCCESS;
        } else {
            codeSuccess = Constants.RESPONSE_CODE.UPDATE_SUCCESS;
        }
        return Response.success(codeSuccess).withData(product);
    }

    /**
     * API lấy danh sách sản phẩm trong vòng 7 ngày
     * @param request
     * @param productForm
     * @return
     */
    @GetMapping("/news-product")
    public Response getProductNew(HttpServletRequest request, ProductForm productForm) {
        return Response.success().withData(productService.getDataTablesProductNew(productForm));
    }

    /**
     * API lấy danh sách sản phẩm đanng sale
     * @param request
     * @param productForm
     * @return
     */
    @GetMapping("/product-sales")
    public Response getProductSale(HttpServletRequest request, ProductForm productForm) {
        return Response.success().withData(productService.getDataTablesProductSale(productForm));
    }

    /**
     * API lấy danh sách sản phẩm bán chạy
     * @param request
     * @param productForm
     * @return
     */
    @GetMapping("/best-sellers-product")
    public Response getProductBestSale(HttpServletRequest request, ProductForm productForm) {
        return Response.success().withData(productService.getDatatablesProductBestSale(productForm));
    }

    @GetMapping("/get-all-product")
    public Response getAllProduct(ProductForm productForm) {
        return Response.success().withData(productService.getAllProduct(productForm));
    }

    /**
     * Api lấy thông tin chi tiết sản phẩm
     * @param idProduct
     * @return
     */
    @GetMapping("/find-by-id/{idProduct}")
    public Response finByIdProduct(@PathVariable("idProduct") Long idProduct) {
        return Response.success().withData(productService.customFindById(idProduct));
    }

    @GetMapping("/stop-selling-products/{idProduct}")
    public Response stopSellingProducts(@PathVariable("idProduct") Long idProduct) {
        try {
            productService.stopSellingProducts(idProduct);
            return Response.success(Constants.RESPONSE_CODE.ACTION_SUCCESS);
        }catch (Exception | ValidateException e) {
            return Response.error(Constants.RESPONSE_CODE.ACTION_ERROR);
        }
    }
}
