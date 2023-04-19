package com.portal.core.common.config;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PaymentConfig {

   public static final String IPDEFAULT = "0:0:0:0:0:0:0:1";
   public static final String VERSIONVNPAY = "2.0.0";
   public static final String COMMAND = "2.0.0";
   public static final String ORDERTYPE = "200000";
   public static final String TMNCODE = "PVPX14DJ";
   public static final String CURRCODE = "VND";
   public static final String LOCALEDEFAULT = "vn";
   public static final String RETURNURL = "http://localhost:8555/api/v1/payment/thong-tin-thanh-toan";// duong linh tra ve khi hoan thanh order
   public static final String CHECKSUM = "ZRPSHJECMCCJQMKTJYISQKFPORNHXHNL";
   public static final String VNPPAYURL = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
   public static final String RETURNRECHARGEURL = "http://localhost:4200/thong-tin-nap-tien";
}