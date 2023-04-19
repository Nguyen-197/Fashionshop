package com.portal.core.module.controller;

import com.portal.core.common.result.Response;
import com.portal.core.module.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/total-status-order")
    public Response totalStatusOrder(@RequestParam Integer date) {
        return analyticsService.totalStatusOrder(date);
    }

    @GetMapping("/total-order-return")
    public Response totalOrderReturn(@RequestParam Integer date) {
        return analyticsService.totalReturnOrder(date);
    }

    @GetMapping("/total-order")
    public Response totalOrder(@RequestParam Integer date) {
        return analyticsService.totalOrder(date);
    }

    @GetMapping("/total-price-order")
    public Response getTotalPriceOrder(@RequestParam Integer date) {
        return analyticsService.totalPriceOrder(date);
    }
}
