
package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.respon.CartDTO;
import com.portal.core.module.entities.Product;
import com.portal.core.module.entities.ProductDetail;
import com.portal.core.module.entities.User;
import com.portal.core.module.repository.ProductDetailRepository;
import com.portal.core.module.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Cart;
import com.portal.core.module.dto.CartForm;
import com.portal.core.module.repository.CartRepository;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Service
public class CartService extends CRUDService<Cart, CartForm> {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public CRUDDao<Cart, Long> getBaseDao() {
        return cartRepository;
    }

	/**
     * getDatatables
     *
     * @param form form
     * @return DataTableResults
     */
    @Override
    public DataTableResults<Cart> getDataTables(CartForm form) {
        return cartRepository.getDatatables(filterData, form);
    }

    public List<CartDTO> findAllByUser(User user) {
        if (user != null) {
            List<CartDTO> listCartDto = cartRepository.getCartByUserLogin(filterData, user.getId());
            if (!CommonUtils.isNullOrEmpty(listCartDto))
                for (CartDTO cartDTO: listCartDto) {
                    String [] image = cartDTO.getImage().toString().split(";");
                    String url = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(image[0])
                            .toUriString();
                    cartDTO.setImage(url);
                }
            return listCartDto;
        }
        return null;
    }

    @Override
    protected void validateBeforeSave(Cart entity, CartForm form) throws ValidateException {
        ProductDetail productDetail = productDetailRepository.findById(CommonUtils.NVL(form.getIdProductDetails())).orElseThrow(() -> new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Sản phẩm không tồn tại"));
        if (form.getQuantity() > productDetail.getQuantity() || form.getQuantity() < 0L) {
            throw new ValidateException(Constants.RESPONSE_CODE.QUANTITY_INVALID, "Số lượng không hợp lệ");
        }
    }

    @Override
    protected void customBeforeSave(Cart entity, CartForm form) throws ValidateException {
        // Lay user login
        User user = userService.getInfomationUser();
        ProductDetail productDetail = productDetailRepository.findById(CommonUtils.NVL(form.getIdProductDetails())).orElseThrow(() -> new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Sản phẩm không tồn tại"));

        // Check update or insert
        if (CommonUtils.NVL(form.getId()).equals(0L)) {
            // Kiểm tra sản phẩm có tồn tại trong giỏ hàng của user
            Cart cart = cartRepository.checkProductExistInTheCart(user.getId(), form.getIdProductDetails());
            if (cart != null) {
                // update lại số lượng sản phẩm
                entity.setId(cart.getId());
                entity.setUser(cart.getUser());
                entity.setProductDetail(cart.getProductDetail());
                Integer quantity = form.getQuantity() + cart.getQuantity();
                entity.setQuantity(quantity);

                // Kiểm tra sản phẩm vượt quá số lượng
                if (entity.getQuantity() > productDetail.getQuantity()) {
                    throw new ValidateException(Constants.RESPONSE_CODE.QUANTITY_INVALID, "Bạn đã có " + cart.getQuantity() + " sản phẩm trong " +
                            "giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.");
                }
            } else {
                entity.setUser(user);
                entity.setProductDetail(productDetail);
            }
        } else {
            entity.setUser(user);
            entity.setProductDetail(productDetail);
        }
    }

    /**
     * Lấy sản phẩm trong giỏ hàng theo user login và id cart
     * @param listIdCart
     * @return
     * @throws ValidateException
     */
    public List<CartDTO> findByUserLoginAndIdCart(List<Long> listIdCart) throws ValidateException {
        User userInfo = userService.getInfomationUser();
        List<CartDTO> listCartDto = new ArrayList<>();
        if (userInfo != null) {
            listCartDto = cartRepository.getCartByUserLogin(filterData, userInfo.getId(), listIdCart);
            if (!CommonUtils.isNullOrEmpty(listCartDto))
                for (CartDTO cartDTO: listCartDto) {
                    String [] image = cartDTO.getImage().toString().split(";");
                    String url = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(image[0])
                            .toUriString();
                    cartDTO.setImage(url);
                }
            return listCartDto;
        }
        return listCartDto;
    }
}
