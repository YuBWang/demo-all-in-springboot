package com.kongbai9029.httpclientdemo.controller;

import com.kongbai9029.httpclientdemo.model.User;
import com.kongbai9029.httpclientdemo.util.RestTemplateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RestTemplateExampleController {
    @Autowired
    private RestTemplateUtil restUtil;

    // GET 无参
    @GetMapping("/example1")
    public User example1() {
        return restUtil.get("http://localhost:8081/user/v1/info", User.class);
    }

    // GET 带占位参数
    @GetMapping("/example2")
    public User example2() {
        Map<String, Object> params = new HashMap<>();
        params.put("name", "张三");
        return restUtil.get("http://localhost:8081/user/v1/info?name={name}", params, User.class);
    }

    // GET 自定义请求头
    @GetMapping("/example3")
    public User example3() {
        HttpHeaders headers = RestTemplateUtil.headers(MediaType.APPLICATION_JSON, "Authorization", "Bearer xxx");
        return restUtil.get("http://localhost:8081/user/v1/info", headers, User.class);
    }

    // POST JSON
    @GetMapping("/example4")
    public User example4() {
        User user = User.builder().name("小李").build();
        return restUtil.post("http://localhost:8081/user/v2/info", user, User.class);
    }

    // POST 表单
    @GetMapping("/example5")
    public User example5() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("name", "张三");
        return restUtil.postForm("http://localhost:8081/user/v3/info", form, User.class);
    }

    // 获取完整 ResponseEntity（状态码、响应头等）
    @GetMapping("/example6")
    public ResponseEntity<User> example6() {
        return restUtil.getForEntity("http://localhost:8081/user/v1/info", User.class);
    }
}
