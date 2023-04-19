package com.portal.core.module.service;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.common.utils.FilterData;
import com.portal.core.module.dto.DetailOrdersForm;
import com.portal.core.module.dto.OrdersForm;
import com.portal.core.module.dto.respon.OrderDTO;
import com.portal.core.module.dto.respon.OrderDetailDTO;
import com.portal.core.module.entities.*;
import com.portal.core.module.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.portal.core.common.result.DataTableResults;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.repository.OrdersRepository;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.*;

@Service
public class OrdersService extends CRUDService<Orders, OrdersForm> {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private DetailOrdersRepository detailOrdersRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public CRUDDao<Orders, Long> getBaseDao() {
        return ordersRepository;
    }

    @Autowired
    private UserService userService;

    @Autowired
    private AddressService addressService;

    @Autowired
    protected FilterData filterData;

    @Autowired
    protected CartRepository cartRepository;

    @Override
    public DataTableResults<Orders> getDataTables(OrdersForm form) {
        return null;
    }

    public DataTableResults<OrderDTO> searchOrder(OrdersForm form) {
        return ordersRepository.getDatatables(filterData, form);
    }

    // Tạo đơn hàng Admin
    @Override
    protected void customBeforeSave(Orders entity, OrdersForm form) throws ValidateException {
        // Kiểm tra số lượng sản phẩm có vượt quá số lượng trong kho
        List<DetailOrdersForm> detailOrdersForms = form.getDetailOrdersList();
        for (DetailOrdersForm item: detailOrdersForms) {
            ProductDetail productDetail = productDetailRepository.findById(item.getProductDetailId()).orElseThrow(() -> new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Sản phẩm không tồn tại"));
            if (item.getQuantity() > productDetail.getQuantity()) { // Nếu số lượng mua vượt quá với số lượng sản phẩm trong kho
                throw new ValidateException(Constants.RESPONSE_CODE.QUANTITY_INVALID, "Số lượng không hợp lệ");
            }
        }
        if(entity.getId()!=null){
            form.setDetailOrdersList(null);
        }else {
            if(form.getPaymentType() == Constants.PAYMENT_TYPE.VN_PAY ){
                entity.setStatus(Constants.STATUS_ORDER.WAITING_PAYMENT);
            }else {
                entity.setStatus(Constants.STATUS_ORDER.APPROVE_ORDER);
                entity.setCreateDateApprove(new Date());
            }
        }
        User user = userRepository.findById(form.getUserId()).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "User không tồn tại"));
        entity.setUser(user);
        Address address  = addressService.findById(form.getIdAddress());
        if (address == null) {
            throw new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED," Địa chỉ không hợp lệ");
        }
        entity.setAddress(address);
        if (form.getDeliveryType().equals(Constants.DELIVERY_TYPE.INSTORE)) { // Nếu nhận tại cửa hàng
            entity.setCodeLading(null); // không có mã vận đơn
            entity.setEstimatedDeliveryTime(null);
        }
        entity.setCreateDate(Calendar.getInstance().getTime());
        User userLogin = userService.getInfomationUser(); // User login
        if (userLogin == null) {
            throw new ValidateException(Constants.RESPONSE_CODE.INVALID_VERIFY_ACCOUNT," Vui lòng đăng nhập!");
        }
        entity.setCreateBy(userLogin.getFullName()); // Người tạo order
    }

    @Override
    protected void customAfterSave(Orders entity, OrdersForm form) throws ValidateException, ValidateException{
        String orderCode = String.format("ORDER" + "%05d", entity.getId());
        entity.setOrderCode(orderCode);
        BigDecimal customerPay = entity.getTotalPrice().add(CommonUtils.NVL(entity.getDeliveryCost(), BigDecimal.ZERO)); // Tổng tiền phải trả
        entity.setCustomerPay(customerPay);
        if(!CommonUtils.isNullOrEmpty(form.getDetailOrdersList())) {
            detailOrdersRepository.deleteAllByOrders(entity);
            List<DetailOrders> detailOrdersList = new ArrayList<>();
            if (!CommonUtils.isNullOrEmpty(form.getDetailOrdersList())) {
                createDetailOrders(entity, form.getDetailOrdersList(), null);
            }
        }
    }

    private void createDetailOrders(Orders orders, List<DetailOrdersForm> detailsOrderList, Long idUser) throws ValidateException {
        for (DetailOrdersForm item : detailsOrderList) {
            DetailOrders detailOrders = new DetailOrders();
            detailOrders.setOrders(orders);
            detailOrders.setUnitPrice(item.getUnitPrice());
            detailOrders.setTotalPrice(item.getTotalPrice());
            detailOrders.setQuantity(item.getQuantity());
            ProductDetail productDetail = productDetailRepository.findById(item.getProductDetailId()).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "chi tiết sản phẩm ko tồnt ại không tồn tại"));
            detailOrders.setProductDetail(productDetail);
            detailOrdersRepository.save(detailOrders);
            // Update lại số lượng sản phẩm
            productDetailRepository.updateQuantityProductDetail(detailOrders.getQuantity(), detailOrders.getProductDetail().getId());
            if (CommonUtils.NVL(idUser) > 0L) {
                // Xóa sản phẩm trong giỏ hàng
                cartRepository.removeProductFromCart(idUser, detailOrders.getProductDetail().getId());
            }

        }
    }

    public Orders findByorderId(Long id) throws ValidateException {
        return ordersRepository.findById(id).orElseThrow(()->  new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED, "Order không tồn tại"));
    }

    /**
     * Tạo đơn hàng cho client
     * @param ordersForm
     * @return
     * @throws ValidateException
     */
    public Orders createOrderCustomer(OrdersForm ordersForm) throws ValidateException {
        User userLogin = userService.getInfomationUser(); // User login
        Address address  = addressService.findById(ordersForm.getIdAddress());
        if (address == null) {
            throw new ValidateException(Constants.RESPONSE_CODE.RECORD_DELETED," Địa chỉ không hợp lệ");
        }
        Orders orders = new Orders();
        BeanUtils.copyProperties(ordersForm, orders);
        orders.setDeliveryType(Constants.DELIVERY_TYPE.INDELIVERY); // nếu là đơn hàng tạo ở customer thì phương thức giao hàng là vận chuyển
        orders.setUser(userLogin);
        orders.setAddress(address);
        orders.setCreateDate(Calendar.getInstance().getTime());
        orders.setStatus(Constants.STATUS_ORDER.ORDER);
        if(ordersForm.getPaymentType() == Constants.PAYMENT_TYPE.VN_PAY ){ // TH chọn phương thúc thanh toán là online
            orders.setStatus(Constants.STATUS_ORDER.WAITING_PAYMENT); // Trạng thái chờ thanh toán
        }else {// TH thanh toán khi nhận  hàng
            orders.setStatus(Constants.STATUS_ORDER.ORDER); // Trạng thái chờ phê duyệt
            orders.setPaymentStatus(Constants.PAYMENT_STATUS.UNPAID);
        }
        ordersRepository.save(orders);
        String orderCode = String.format("ORDER" + "%05d", orders.getId());
        orders.setOrderCode(orderCode);
        BigDecimal customerPay = orders.getTotalPrice().add(CommonUtils.NVL(orders.getDeliveryCost(), BigDecimal.ZERO)); // Tổng tiền phải trả
        orders.setCustomerPay(customerPay);
        if (!CommonUtils.isNullOrEmpty(ordersForm.getDetailOrdersList())) {
            createDetailOrders(orders, ordersForm.getDetailOrdersList(), userLogin.getId());
        }
        return orders;
    }

    public List<OrderDTO> getOrderByStatus(Integer status) throws ValidateException {
        User userLogin = userService.getInfomationUser(); // User login
        List<OrderDTO> lstOrderDTO = ordersRepository.getOrderByStatus(filterData, status, userLogin.getId());
        for (OrderDTO item: lstOrderDTO) {
            String[] images = item.getImages().split(";");
            List<String> lstImageItem = new ArrayList<>();
            for (String element: images) {
                String url = ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/file-storage/files/")
                        .path(element)
                        .toUriString();
                lstImageItem.add(url);
            }
            item.setImages(String.join(";", lstImageItem));
        }
        return lstOrderDTO;
    }

    @Scheduled(cron = "${schedule.clear.order}")
    public void ScheduleDeleteOrder() {
        System.out.println("Start ScheduleDeleteOrder");
        List<Orders> orders = ordersRepository.getListOrderOverduePayment();
        if(!CommonUtils.isNullOrEmpty(orders)){
            for (Orders order : orders) {
                updateQuantityorder(order.getId());
                ordersRepository.deleteById(order.getId());
                System.out.println("Update quantitiy and detele");
            }
        }
        System.out.println("End ScheduleDeleteOrder");
    }

    void updateQuantityorder(Long id){
        ordersRepository.updateQuantity(id);
    }

    public Response cancelOrderCustomer(Long idOrder) {
        try {
            Orders orders = this.findById(idOrder);
            if (orders != null) {
                if (orders.getStatus().equals(Constants.STATUS_ORDER.ORDER)) {
                    ordersRepository.cancelOrderCustomer(orders.getId());
                    ordersRepository.updateQuantity(orders.getId());  // Update lại số lượng của sản phẩm
                    orders.setCreateDateCancel(Calendar.getInstance().getTime());
                    return Response.success(Constants.RESPONSE_CODE.CANCEL_SUCCESS).withData("cancel.success");
                }
            }
            return Response.error(Constants.RESPONSE_CODE.ERROR).withData("cancel.error");
        } catch (Exception e) {
            return Response.error(Constants.RESPONSE_CODE.ERROR).withData("cancel.error");
        }
    }

    public Response cancelOrderAdmin (Long idOrder) {
        try {
            Orders orders = this.findById(idOrder);
            if (orders != null) {
                if (orders.getStatus().equals(Constants.STATUS_ORDER.DELIVERING) || orders.getStatus().equals(Constants.STATUS_ORDER.COMPLETE_ORDER)) {
                    return Response.error(Constants.RESPONSE_CODE.ERROR).withData("cancel.error");
                } else {
                    ordersRepository.cancelOrderAdmin(orders.getId());
                    ordersRepository.updateQuantity(orders.getId());  // Update lại số lượng của sản phẩm
                    return Response.success(Constants.RESPONSE_CODE.CANCEL_SUCCESS).withData("cancel.success");
                }
            }
            return Response.error(Constants.RESPONSE_CODE.ERROR).withData("cancel.error");
        } catch (Exception e) {
            return Response.error(Constants.RESPONSE_CODE.ERROR).withData("cancel.error");
        }
    }

    @Transactional
    public Response changeStatusOrder(Long idOrder, Integer status) {
        try {
            Orders orders = this.findById(idOrder);
            if (orders != null) {
                if (orders.getStatus().equals(Constants.STATUS_ORDER.COMPLETE_ORDER) || orders.getStatus().equals(Constants.STATUS_ORDER.CANCEL_ORDER)) {
                    return Response.error(Constants.RESPONSE_CODE.ERROR).withData(Constants.RESPONSE_CODE.ACTION_ERROR);
                } else {
                    if (status.equals(Constants.STATUS_ORDER.COMPLETE_ORDER) && orders.getPaymentStatus().equals(Constants.PAYMENT_STATUS.UNPAID)) { // Nếu trạng thái đơn hàng là hoàn thành và trạng thái thanh toán là chưa thanh toán
                        // thay đổi trạng thái đơn hàng thành đã thanh toán khi đơn hàng đã được giao
                        orders.setPaymentStatus(Constants.PAYMENT_STATUS.PAID);
                    }
                    if (status.equals(Constants.STATUS_ORDER.APPROVE_ORDER)) {
                        orders.setCreateDateApprove(Calendar.getInstance().getTime());
                    } else if (status.equals(Constants.STATUS_ORDER.PACK_ORDER)) {
                        orders.setCreateDatePack(Calendar.getInstance().getTime());
                    } else if (status.equals(Constants.STATUS_ORDER.DELIVERING)) {
                        orders.setCreateDateDelivering(Calendar.getInstance().getTime());
                    } else if (status.equals(Constants.STATUS_ORDER.COMPLETE_ORDER)) {
                        orders.setCreateDateComplete(Calendar.getInstance().getTime());
                    } else if (status.equals(Constants.STATUS_ORDER.CANCEL_ORDER)) {
                        orders.setCreateDateCancel(Calendar.getInstance().getTime());
                    }
                    ordersRepository.updateStatusAdmin(status, orders.getId());
                    return Response.success(Constants.RESPONSE_CODE.ACTION_SUCCESS).withData("change.success");
                }

            }
            return Response.error(Constants.RESPONSE_CODE.ERROR).withData(Constants.RESPONSE_CODE.ACTION_SUCCESS);
        } catch (Exception e) {
            return Response.error(Constants.RESPONSE_CODE.ERROR).withData(Constants.RESPONSE_CODE.ACTION_ERROR);
        }
    }

    public Response changePaymentStatus(Long idOrder) throws ValidateException {
        try {
            Orders order = ordersRepository.findById(idOrder).orElseThrow(() -> new ValidateException((Constants.RESPONSE_CODE.RECORD_DELETED), "Order không tồn tại"));
            if (order.getDeliveryType().equals(Constants.DELIVERY_TYPE.INSTORE)) {
                ordersRepository.updatePaymentStatusWithOrderInStore(order.getId()); // update lại trạng thái thanh toán với đơn nhận tại cửa hàng
                return Response.success(Constants.RESPONSE_CODE.ACTION_SUCCESS).withData("payment.success");
            }
            return Response.success().withData("payment.error");
        }catch (Exception e) {
            return Response.success().withData("payment.error");
        }
    }

    /**
     * Hàm xem chi tiết đơn hàng
     * @param idOrder
     * @return
     */
    public OrderDTO findOrderById(Long idOrder) {
        try {
            List<OrderDTO> lstOrder = ordersRepository.findOrderById(filterData, idOrder);
            if (!CommonUtils.isNullOrEmpty(lstOrder)) {
                OrderDTO order = lstOrder.get(0);
                List<OrderDetailDTO> listOrderDetails = detailOrdersRepository.getProductDetailByIdOrder(filterData, order.getId());
                if (!CommonUtils.isNullOrEmpty(listOrderDetails)) {
                    for (OrderDetailDTO orderDetail : listOrderDetails) {
                        String urlDetail = ServletUriComponentsBuilder
                                .fromCurrentContextPath()
                                .path("/api/file-storage/files/")
                                .path(orderDetail.getImage().toString().split(";")[0])
                                .toUriString();
                        orderDetail.setImage(urlDetail);
                    }
                }
                order.setLstOrderDetail(listOrderDetails);
                return order;
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     *
     * @param ordersForm
     * @return
     */
    public DataTableResults<OrderDTO> getOrderProbablyReturn(OrdersForm ordersForm) {
        return ordersRepository.getOrderProbablyReturn(filterData, ordersForm);
    }

    /**
     * Hàm lấy thông tin và số lượng sản phẩm có thể đổi trả
     * @param idOrder
     * @return
     */
    public OrderDTO getOrderDetailProbablyReturn(Long idOrder) {
        try {
            OrderDTO order = ordersRepository.getOrderProbablyReturn(filterData, idOrder);
            List<OrderDetailDTO> listOrderDetailsProbablyReturn = detailOrdersRepository.getListOrderDetailsProbablyReturnByIdOrder(filterData, order.getId());
            if (!CommonUtils.isNullOrEmpty(listOrderDetailsProbablyReturn)) {
                for (OrderDetailDTO orderDetail : listOrderDetailsProbablyReturn) {
                    if (CommonUtils.isNullOrEmpty(orderDetail.getImage())) {
                        continue;
                    }
                    String urlDetail = ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/api/file-storage/files/")
                            .path(orderDetail.getImage().toString().split(";")[0])
                            .toUriString();
                    orderDetail.setImage(urlDetail);
                }
            }
            order.setLstOrderDetail(listOrderDetailsProbablyReturn);
            return order;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}


