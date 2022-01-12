package com.kongbai9029.httpclientdemo.controller;

import com.kongbai9029.httpclientdemo.model.User;
import com.kongbai9029.httpclientdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @Author: wyb
 * @Date: 2022/1/11 20:41
 */
@RestController
@RequestMapping("user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/v1/info")
    public User infoV1() {
        return userService.getUser();
    }

    @PostMapping("/v2/info")
    public User infoV2(@RequestBody User user) {
        if (user.getName() != null) {
            return userService.getUser();
        }
        return new User();
    }
}
