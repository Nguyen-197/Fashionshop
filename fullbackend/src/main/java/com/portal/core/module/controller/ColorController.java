
package com.portal.core.module.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portal.core.common.base.controller.CRUDController;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.module.entities.Color;
import com.portal.core.module.dto.ColorForm;
import com.portal.core.module.service.ColorService;

/**
 * @author yuno_shop
 * @version 1.0
 */
@Controller
@RequestMapping("/api/v1/color")
public class ColorController extends CRUDController<Color, ColorForm> {

    @Autowired
    private ColorService colorService;

    @Override
    protected CRUDService<Color, ColorForm> getMainService() {
        return colorService;
    }

    @Override
    protected Class<Color> getClassEntity() {
        return Color.class;
    }
}
