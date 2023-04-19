
package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.respon.ProductDTO;
import com.portal.core.module.dto.respon.ProductDetailDTO;
import com.portal.core.module.entities.*;
import com.portal.core.module.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.dto.ProductForm;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;


@Service
public class ProductService extends CRUDService<Product, ProductForm> {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public CRUDDao<Product, Long> getBaseDao() {
        return productRepository;
    }

    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductDetailRepository productDetailRepository;

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<Product> getDataTables(ProductForm form) {
        DataTableResults<Product> datatables = productRepository.getDatatables(filterData, form);
        if (datatables != null)
            for (Product product: datatables.getData()) {
                if (CommonUtils.isNullOrEmpty(product.getImage())) {
                    continue;
                }
                String [] image = product.getImage().toString().split(";");
                List<String> images = new ArrayList<>();
                for (String element: image) {
                    String url = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(element)
                            .toUriString();
                    images.add(url);
                }
                product.setImage(String.join(";", images));
            }
        return datatables;
    }

    /**
     * lấy danh sách sản phẩm mới trong vòng 7 ngày
     *
     * @param form form
     * @return DataTableResults
     */
    public DataTableResults<Product> getDataTablesProductNew(ProductForm form) {
        DataTableResults<Product> datatables = productRepository.getDatatablesProductNew(filterData, form);
        if (datatables != null)
            for (Product product: datatables.getData()) {
                String [] image = product.getImage().toString().split(";");
                String url = ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/file-storage/files/")
                        .path(image[0].toString())
                        .toUriString();
                product.setImage(url);
            }
        return datatables;
    }

    /**
     * lấy danh sách sản phẩm đang sale
     *
     * @param form form
     * @return DataTableResults
     */
    public DataTableResults<Product> getDataTablesProductSale(ProductForm form) {
        DataTableResults<Product> datatables = productRepository.getDatatablesProductSale(filterData, form);
        if (datatables != null)
            for (Product product: datatables.getData()) {
                String [] image = product.getImage().toString().split(";");
                List<String> images = new ArrayList<>();
                for (String element: image) {
                    String url = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(element)
                            .toUriString();
                    images.add(url);
                }
                product.setImage(String.join(";", images));
            }
        return datatables;
    }

    /**
     * lấy danh sách sản phẩm bán chạy
     *
     * @param form form
     * @return DataTableResults
     */
    public DataTableResults<Product> getDatatablesProductBestSale(ProductForm form) {
        DataTableResults<Product> datatables = productRepository.getDatatablesProductBestSale(filterData, form);
        if (datatables != null)
            for (Product product: datatables.getData()) {
                String [] image = product.getImage().toString().split(";");
                List<String> images = new ArrayList<>();
                for (String element: image) {
                    String url = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(element)
                            .toUriString();
                    images.add(url);
                }
                product.setImage(String.join(";", images));
            }
        return datatables;
    }

    @Override
    protected void validateBeforeSave(Product entity, ProductForm form) throws ValidateException {
        List<Product> lstConfilicCode;
        Long id = CommonUtils.NVL(form.getId());
        if (id.equals(0L)) {
            lstConfilicCode = productRepository.findConflicCode(form.getCode().toString().trim());
        } else {
            lstConfilicCode = productRepository.findConflicCode(id, form.getCode().toString().trim());
        }

        if (!CommonUtils.isNullOrEmpty(lstConfilicCode)) {
            throw new ValidateException(Constants.RESPONSE_CODE.DUPLICATE_CODE, "Mã code đã tồn tại");
        }
    }

    @Override
    protected void customBeforeSave(Product entity, ProductForm form) throws ValidateException {
        Long id = CommonUtils.NVL(form.getId());
        Category category = categoryRepository.findById(CommonUtils.NVL(form.getIdCategory())).orElseThrow(() ->
            new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Danh mục không tồn tại"));
        entity.setCategory(category);
        entity.setIsDelete(false);
        if (CommonUtils.NVL(form.getId()).equals(0L)) {
            entity.setCreatedDate(Calendar.getInstance().getTime());
        }
    }

    @Override
    protected void customAfterSave(Product entity, ProductForm form) throws ValidateException {
        String code = String.format("PRODUCT" + "%05d", entity.getId());
        entity.setCode(code);
        // Lưu danh sách product detail, chỉ thêm danh sách product detail khi thêm mới product
        if((!CommonUtils.isNullOrEmpty(form.getListProductDetail()))) {
            productDetailService.saveOrUpdateProductDetail(entity, form.getListProductDetail());
        }
    }

    public List<ProductDTO> getAllProduct(ProductForm productForm) {
        List<ProductDTO> listProduct = productRepository.getAllProduct(filterData, productForm);
        if (!CommonUtils.isNullOrEmpty(listProduct)) {
            for (ProductDTO productDTO: listProduct) {
                String url = ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/file-storage/files/")
                        .path(productDTO.getImage().toString().split(";")[0])
                        .toUriString();
                productDTO.setImage(url);
                List<ProductDetailDTO> productDetailDTO = productDetailRepository.getAllByIdProduct(filterData, productDTO.getId());
                if (!CommonUtils.isNullOrEmpty(productDetailDTO)) {
                    for (ProductDetailDTO productDetail: productDetailDTO) {
                        if (CommonUtils.isNullOrEmpty(productDetail.getImage())) {
                            continue;
                        }
                        String urlDetail = ServletUriComponentsBuilder
                                .fromCurrentContextPath()
                                .path("/api/file-storage/files/")
                                .path(productDetail.getImage().toString().split(";")[0])
                                .toUriString();
                        productDetail.setImage(urlDetail);
                    }
                    productDTO.setListProductDetails(productDetailDTO);
                }
            }
        }
        return listProduct;
    }

    public ProductDTO customFindById(Long id) {
        try {
            List<ProductDTO> lstProductDto = productRepository.findByIdProduct(filterData, id);
            if (!CommonUtils.isNullOrEmpty(lstProductDto)) {
                ProductDTO productDTO = lstProductDto.get(0);
                String [] image = productDTO.getImage().toString().split(";");
                List<String> images = new ArrayList<>();
                for (String element: image) {
                    String url = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(element)
                            .toUriString();
                    images.add(url);
                }
                productDTO.setImage(String.join(";", images));
                List<ProductDetailDTO> listProductDetail = productDetailRepository.getAllByIdProduct(filterData, productDTO.getId());
                if (!CommonUtils.isNullOrEmpty(listProductDetail)) {
                    for (ProductDetailDTO productDetail: listProductDetail) {
                        String [] imageDetail = productDetail.getImage().toString().split(";");
                        List<String> imageDetails = new ArrayList<>();
                        for (String element: imageDetail) {
                            String urlDetail = ServletUriComponentsBuilder
                                    .fromCurrentContextPath()
                                    .path("/api/file-storage/files/")
                                    .path(element)
                                    .toUriString();
                            imageDetails.add(urlDetail);
                        }
                        productDetail.setImage(String.join(";", imageDetails));
                    }
                    productDTO.setListProductDetails(listProductDetail);
                }
                return productDTO;
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Hàm ngừng kinh doanh sản phẩm
     * @param idProduct
     */
    public void stopSellingProducts(Long idProduct) throws ValidateException {
        Product product = productRepository.findById(idProduct).orElseThrow(() -> new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Sản phẩm không tồn tại"));
        productRepository.stopSellingProducts(!product.getIsDelete(), idProduct);
    }

}
