package com.portal.core.module.controller;

import com.portal.core.common.config.PaymentConfig;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.Constants;
import com.portal.core.common.utils.DataUtil;
import com.portal.core.module.dto.PaymentDTO;
import com.portal.core.module.dto.PaymentResDTO;
import com.portal.core.module.dto.TransactionInfo;
import com.portal.core.module.dto.TransactionStatusDTO;
import com.portal.core.module.entities.Orders;
import com.portal.core.module.entities.PaymentHistory;
import com.portal.core.module.repository.PaymentHistoryRepository;
import com.portal.core.module.service.OrdersService;
import com.portal.core.module.service.PaymentHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @Autowired
    OrdersService ordersService;

    @Autowired
    PaymentHistoryRepository paymentHistoryRepository;

    @PostMapping("/create-payment")
    public Response createPayment(
            @RequestBody PaymentDTO requestParams) throws ValidateException, UnsupportedEncodingException {

        int amount = requestParams.getAmount() * 100;

        ordersService.findByorderId(requestParams.getOrderId());

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", PaymentConfig.VERSIONVNPAY);
        vnp_Params.put("vnp_Command", PaymentConfig.COMMAND);
        vnp_Params.put("vnp_TmnCode", PaymentConfig.TMNCODE);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", PaymentConfig.CURRCODE);
        vnp_Params.put("vnp_BankCode", requestParams.getBankCode());
        vnp_Params.put("vnp_TxnRef",   String.valueOf(requestParams.getOrderId()));
        vnp_Params.put("vnp_OrderInfo", requestParams.getDescription());
        vnp_Params.put("vnp_OrderType", PaymentConfig.ORDERTYPE);
        vnp_Params.put("vnp_Locale", PaymentConfig.LOCALEDEFAULT);
        vnp_Params.put("vnp_ReturnUrl", PaymentConfig.RETURNURL);
        vnp_Params.put("vnp_IpAddr", PaymentConfig.IPDEFAULT);

        Date dt = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String dateString = formatter.format(dt);

        String vnp_CreateDate = dateString;
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {

                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(fieldValue);

                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = DataUtil.Sha256(PaymentConfig.CHECKSUM + hashData.toString());
        queryUrl += "&vnp_SecureHashType=SHA256&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = PaymentConfig.VNPPAYURL + "?" + queryUrl;

        PaymentResDTO result = new PaymentResDTO();
        result.setStatus("00");
        result.setMessage("success");
        result.setUrl(paymentUrl);
        return Response.success().withData(result);
    }

    @ResponseBody
    @GetMapping("/thong-tin-thanh-toan")
    public Response transactionHandle(

            @RequestParam(value = "vnp_Amount", required = false) String amount,
            @RequestParam(value = "vnp_BankCode", required = false) String bankCode,
            @RequestParam(value = "vnp_BankTranNo", required = false) String bankTranNo,
            @RequestParam(value = "vnp_CardType", required = false) String cardType,
            @RequestParam(value = "vnp_OrderInfo", required = false) String orderInfo,
            @RequestParam(value = "vnp_PayDate", required = false) String payDate,
            @RequestParam(value = "vnp_ResponseCode",required = false) String responseCode,
            @RequestParam(value = "vnp_TmnCode", required = false) String tmnCode,
            @RequestParam(value = "vnp_TransactionNo", required = false) String transactionNo,
            @RequestParam(value = "vnp_TxnRef", required = false) String txnRef,
            @RequestParam(value = "vnp_SecureHashType", required = false) String secureHashType,
            @RequestParam(value = "vnp_SecureHash", required = false) String secureHash

    ) throws ValidateException {

        TransactionStatusDTO result = new TransactionStatusDTO();
        if (!responseCode.equalsIgnoreCase("00")){
            result.setStatus("02");
            result.setMessage("x");
            result.setData(null);
            return Response.success().withData(result);
        }

        if (txnRef == null) {
            result.setStatus("11");
            result.setMessage("Order does not exist");
            result.setData(null);

            return Response.success().withData(result);
        }
        Orders orders = ordersService.findByorderId(Long.parseLong(txnRef));


        if (orders.getId()== Long.parseLong(txnRef));
        {
            orders.setPaymentStatus(Constants.PAYMENT_STATUS.PAID);
            orders.setStatus(Constants.STATUS_ORDER.APPROVE_ORDER);
            orders.setCreateDateApprove(new Date());

            PaymentHistory paymentHistory = new PaymentHistory();
            paymentHistory.setAmount(amount);
            paymentHistory.setBankCode(bankCode);
            paymentHistory.setBankTranNo(bankTranNo);
            paymentHistory.setCardType(cardType);
            paymentHistory.setOrderInfo(orderInfo);
            paymentHistory.setPayDate(payDate);
            paymentHistory.setResponseCode(responseCode);
            paymentHistory.setTmnCode(tmnCode);
            paymentHistory.setTransactionNo(transactionNo);
            paymentHistory.setTxnRef(txnRef);
            paymentHistory.setSecureHashType(secureHashType);
            paymentHistory.setSecureHash(secureHash);

            PaymentHistory resultData  =   paymentHistoryRepository.save(paymentHistory);

            TransactionInfo info = new TransactionInfo();
            info.setAmout(resultData.getAmount());
            info.setBankCode(resultData.getBankCode());
            info.setCardType(resultData.getCardType());
            info.setDescription(resultData.getOrderInfo());
            info.setPayDate(new Date());
            info.setTxnRef(resultData.getTxnRef());

            resultData.setPayDate(new Date().toString());
            result.setStatus("00");
            result.setMessage("success");
            result.setData(info);

            return Response.success().withData(result);
        }
//        result.setStatus("02");
//        result.setMessage("failed");
//        result.setData(null);
    }
}