package com.kongbai9029.rrweb.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: wyb
 * @Date: 2022/1/24 17:34
 */
@Controller
@RequestMapping("/login")
public class LoginController {

    @RequestMapping("/logins")
    public String info() {
        return "/login";
    }

    @RequestMapping("/replay")
    public String replay() {
        return "/replay";
    }

    @RequestMapping("/replayVideo")
    public String replayVideo() {
        return "/replayVideo";
    }



}
