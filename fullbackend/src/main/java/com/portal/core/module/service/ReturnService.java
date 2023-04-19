package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.dto.DetailReturnForm;
import com.portal.core.module.dto.respon.DetailReturnDTO;
import com.portal.core.module.dto.respon.ReturnDTO;
import com.portal.core.module.entities.*;
import com.portal.core.module.repository.DetailReturnRepository;
import com.portal.core.module.repository.ProductDetailRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.dto.ReturnForm;
import com.portal.core.module.repository.ReturnRepository;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;


@Service
public class ReturnService extends CRUDService<Return, ReturnForm> {

    @Autowired
    private ReturnRepository returnRepository;

    @Autowired
    private OrdersService ordersService;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private DetailReturnRepository detailOrderDetailReturnRepository;

    @Autowired
    private DetailOrdersService detailOrdersService;

    @Autowired
    private UserService userService;

    @Override
    public CRUDDao<Return, Long> getBaseDao() {
        return returnRepository;
    }

    @Override
    public DataTableResults<Return> getDataTables(ReturnForm form) {
        return returnRepository.getDatatables(filterData, form);
    }


    @Override
    protected void validateBeforeSave(Return entity, ReturnForm form) throws ValidateException {
        List<DetailReturnForm> listDetailReturn = form.getDetailReturnFormList();
        if (!CommonUtils.isNullOrEmpty(listDetailReturn)) {
            for (DetailReturnForm item : listDetailReturn) {
                DetailOrders detailOrder = detailOrdersService.findById(item.getOrderDetailId());
                if (detailOrder == null) {
                    throw new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Không tồn tại sản phẩm trong đơn hàng");
                }
                if (item.getQuantity() > detailOrder.getQuantity()) {
                    throw new ValidateException(Constants.RESPONSE_CODE.QUANTITY_INVALID, "Số lượng đổi trả vượt quá số lượng đã mua");
                }
            }
        }
    }

    @Override
    protected void customBeforeSave(Return entity, ReturnForm form) throws ValidateException {
        if(entity.getId()!=null){
            form.setDetailReturnFormList(null);
        }
        Orders orders = ordersService.findByorderId(form.getOrdersId());
        entity.setOrders(orders);
        User useLogin = userService.getInfomationUser(); // Lấy thông tin user login
        if (useLogin == null) {
            throw new ValidateException(Constants.RESPONSE_CODE.INVALID_VERIFY_ACCOUNT, "Vui lòng đăng nhập");
        }
        entity.setCreateBy(useLogin.getFullName());
        if (entity.getStatus().equals(Constants.STATUS_RETURN.ITEM_RECEIVED)) {
            entity.setCreateDateReceive(Calendar.getInstance().getTime()); // Thời gian nhận hàng
        }
        if (entity.getStatusRefund().equals(Constants.STATUS_REFUND.PAID)) {
            entity.setCreateDatePayment(Calendar.getInstance().getTime());  // Thời gian thanh toán
        }
    }

    @Override
    protected void customAfterSave(Return entity, ReturnForm form) throws ValidateException {
        String orderCode = String.format("RETURN" + "%05d", entity.getId());
        entity.setReturnCode(orderCode);
        if(!CommonUtils.isNullOrEmpty(form.getDetailReturnFormList())){
            detailOrderDetailReturnRepository.deleteAllByReturns(entity);
            List<DetailReturn> detailReturn = new ArrayList<>();
            for (DetailReturnForm i : form.getDetailReturnFormList()) {
                DetailReturn detailOrders = createDetailReturn(entity, i);
                detailReturn.add(detailOrders);
            }
        }
    }

    private DetailReturn createDetailReturn(Return entity, DetailReturnForm form) throws ValidateException {
        DetailReturn detailReturn = new DetailReturn();
        detailReturn.setPrice(form.getPrice());
        detailReturn.setQuantity(form.getQuantity());
        DetailOrders detailOrders = detailOrdersService.findById(form.getOrderDetailId());
        if (detailOrders == null) {
            throw new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Không tồn tại sản phẩm trong đơn hàng");
        }
        detailReturn.setDetailOrders(detailOrders);
        detailReturn.setReturns(entity);
        detailOrderDetailReturnRepository.save(detailReturn);
        if (entity.getStatus().equals(Constants.STATUS_RETURN.ITEM_RECEIVED)) {
            // Update lại số lượng sản phẩm
            if (detailOrders != null) {
                productDetailRepository.updateQuantityProductDetail(detailReturn.getQuantity() * -1, detailOrders.getProductDetail().getId());
            }
        }
        return detailReturn;
    }

    public Return createReturnOrderCustomer(ReturnForm returnForm) throws ValidateException {
        Orders orders = ordersService.findByorderId(returnForm.getOrdersId());
        if (!orders.getStatus().equals(Constants.STATUS_ORDER.CANCEL_ORDER)) {
            throw new ValidateException("return.error", "Đơn hàng chưa hoàn tất, không thể tạo đơn trả hàng");
        }
        Return returnOrder = new Return();
        BeanUtils.copyProperties(returnForm, returnOrder);
        returnOrder.setCreateDate(Calendar.getInstance().getTime());
        returnOrder.setOrders(orders);
        returnRepository.save(returnOrder);
        String returnCode = String.format("RETURN" + "%05d", returnOrder.getId());
        returnOrder.setReturnCode(returnCode);
        return returnOrder;
    }

    /**
     * Hàm phê duyệt đơn trả hàng
     * @param idReturn
     * @return
     * @throws ValidateException
     */
    @Transactional
    public Response changeStatusReturnOrder(Long idReturn, Integer status) throws ValidateException {
        try {
            Return returnOrder = returnRepository.findById(idReturn).orElseThrow(() -> new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Đơn đổi trả không tồn tại"));
            if (status.equals(Constants.STATUS_RETURN.ITEM_RECEIVED)) {
                returnOrder.setCreateDateReceive(Calendar.getInstance().getTime()); // Thời gian nhận hàng
                List<DetailReturn> lstDetailReturn = detailOrderDetailReturnRepository.findAllByReturns(returnOrder);
                if (!CommonUtils.isNullOrEmpty(lstDetailReturn)) {
                    for (DetailReturn detailReturn : lstDetailReturn) {
                        // Update lại số lượng sản phẩm
                        DetailOrders detailOrders = detailOrdersService.findById(detailReturn.getDetailOrders().getId());
                        if (detailOrders == null) {
                            throw new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Không tồn tại sản phẩm trong đơn hàng");
                        }
                        productDetailRepository.updateQuantityProductDetail(detailReturn.getQuantity() * -1, detailOrders.getProductDetail().getId());
                    }
                }
            }
            returnRepository.updateStatusReturnOrder(status, returnOrder.getId()); // Thay đổi trạng thái đơn trả hàng
            return Response.success(Constants.RESPONSE_CODE.ACTION_SUCCESS);
        }catch (Exception e) {
            return Response.error(Constants.RESPONSE_CODE.ACTION_ERROR);
        }
    }

    @Transactional
    public Response changeStatusRefund(Long idReturn) throws ValidateException {
        try {
            Return returnOrder = returnRepository.findById(idReturn).orElseThrow(() -> new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Đơn đổi trả không tồn tại"));
            if (returnOrder.getStatusRefund().equals(Constants.STATUS_REFUND.UNPAID)) { // Nếu trạng thái đơn trả là chưa thanh toán
                returnOrder.setCreateDatePayment(Calendar.getInstance().getTime());  // Thời gian thanh toán
                returnRepository.updateStatusRefund(returnOrder.getId());               // Xác nhận thanh toán cho đơn trả
                return Response.success(Constants.RESPONSE_CODE.ACTION_SUCCESS);
            }
            return Response.error(Constants.RESPONSE_CODE.ACTION_ERROR);
        } catch (Exception e) {
            return Response.error(Constants.RESPONSE_CODE.ACTION_ERROR);
        }
    }

    public DataTableResults<ReturnDTO> searchReturnOrder(ReturnForm form) {
        return returnRepository.searchReturnOrder(filterData, form);
    }

    public Response getDetailRetun(Long idReturn) {
        try {
            ReturnDTO returnDTO = returnRepository.getDetailReturn(filterData, idReturn);
            if (returnDTO == null) {
                return Response.warning(Constants.RESPONSE_CODE.RECORD_DELETED);
            }
            List<DetailReturnDTO> listDetailReturn = detailOrderDetailReturnRepository.getListDetailReturn(filterData, returnDTO.getId());
            if (!CommonUtils.isNullOrEmpty(listDetailReturn)) {
                for (DetailReturnDTO detailReturn : listDetailReturn) {
                    String urlDetail = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(detailReturn.getImage().toString().split(";")[0])
                            .toUriString();
                    detailReturn.setImage(urlDetail);
                }
            }
            returnDTO.setListDetailReturn(listDetailReturn);
            return Response.success().withData(returnDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
