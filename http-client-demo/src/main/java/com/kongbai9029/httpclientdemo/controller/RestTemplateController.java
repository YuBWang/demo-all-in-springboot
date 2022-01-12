package com.kongbai9029.httpclientdemo.controller;

import com.kongbai9029.httpclientdemo.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * @Author: wyb
 * @Date: 2022/1/12 16:41
 */
@RestController
@RequestMapping("restTemplate")
public class RestTemplateController {
   private RestTemplate restTemplate = new RestTemplate();

    /**
     * 以get方式请求第三方http接口 getForObject
     * 返回值返回的是响应体，省去了我们再去getBody()
     * @return
     */
    @GetMapping("/v1/info")
    public User infoV1() {
        String url = "http://localhost:8081/user/v1/info";
        ResponseEntity<User> responseEntity = restTemplate.getForEntity(url, User.class);
        return responseEntity.getBody();
    }

    /**
     * 以post方式请求第三方http接口 postForEntity
     * @return
     */
    @GetMapping("/v2/info")
    public User infoV2() {
        String url = "http://localhost:8081/user/v2/info";
        User user = User.builder().name("小李").build();
        ResponseEntity<User> responseEntity = restTemplate.postForEntity(url, user, User.class);
        return responseEntity.getBody();
    }

    /**
     * 以post方式请求第三方http接口 postForEntity
     * @return
     */
    @GetMapping("/v3/info")
    public User infoV3() {
        String url = "http://localhost:8081/user/v2/info";
        User user = User.builder().name("小李").build();
        return  restTemplate.postForObject(url, user, User.class);
    }
}
