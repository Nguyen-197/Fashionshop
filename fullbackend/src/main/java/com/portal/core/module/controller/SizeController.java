
package com.portal.core.module.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Size;
import com.portal.core.module.dto.SizeForm;
import com.portal.core.module.service.SizeService;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/api/v1/size")
public class SizeController extends CRUDController<Size, SizeForm> {

    @Autowired
    private SizeService sizeService;

    @Override
    protected CRUDService<Size, SizeForm> getMainService() {
        return sizeService;
    }

    @Override
    protected Class<Size> getClassEntity() {
        return Size.class;
    }
}
