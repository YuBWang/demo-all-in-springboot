package com.kongbai9029.httpclientdemo.controller;

import com.kongbai9029.httpclientdemo.model.User;
import com.kongbai9029.httpclientdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("resinterceptor")
public class RestIntercepttorController {
    @Autowired
    private UserService userService;


    @GetMapping("/v1/info")
    public User infoV1() {
        return userService.getUser("rr");
    }


}
