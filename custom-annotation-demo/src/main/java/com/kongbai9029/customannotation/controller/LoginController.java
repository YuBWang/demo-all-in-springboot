package com.kongbai9029.customannotation.controller;

import com.kongbai9029.customannotation.anno.LoginRequired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: wyb
 * @Date: 2022/1/24 17:34
 */
@RestController
@RequestMapping("login")
public class LoginController {
    @LoginRequired
    @GetMapping("source")
    public String source() {
        return "into login source";
    }


}
