
package com.portal.core.module.controller;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.Response;
import com.portal.core.common.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Promotion;
import com.portal.core.module.dto.PromotionForm;
import com.portal.core.module.service.PromotionService;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/api/v1/promotion")
public class PromotionController extends CRUDController<Promotion, PromotionForm> {

    @Autowired
    private PromotionService promotionService;

    @Override
    protected CRUDService<Promotion, PromotionForm> getMainService() {
        return promotionService;
    }

    @Override
    protected Class<Promotion> getClassEntity() {
        return Promotion.class;
    }

    /**
     * API thay đổi trạng thái hoạt động của
     * @param status
     * @return
     */
    @PostMapping("/admin/change-status-promotion/{idPromotion}")
    public Response changeStatusPromotion(@RequestParam Integer status, @PathVariable("idPromotion") Long idPromotion) {
        return promotionService.changeStatusPromotion(status, idPromotion);
    }

    @GetMapping("/find-by-id/{id}")
    public Response findByIdPromotion(@PathVariable("id") Long id) throws ValidateException {
        return Response.success().withData(promotionService.findByIdPromotion(id));
    }

}
