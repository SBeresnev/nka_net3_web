package com.nkanet.belonovich;

/**
 * Created by belonovich on 20.01.2015.
 */
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.lang.reflect.Type;

@Controller
@RequestMapping(value = "/", produces = {
        "application/xml;charset=UTF-8", "text/xml;charset=UTF-8",
        "application/x-www-form-urlencoded;charset=UTF-8" })
public class MainController<T extends Float> {

    @RequestMapping(method = RequestMethod.GET)
    public String printWelcome(ModelMap model) {
        return "main";
    }
}