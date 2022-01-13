package com.kongbai9029.httpclientdemo.controller;

import com.alibaba.fastjson.JSONObject;
import com.kongbai9029.httpclientdemo.model.User;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: wyb
 * @Date: 2022/1/12 16:41
 */
@RestController
@RequestMapping("restTemplate")
public class RestTemplateController {
   private RestTemplate restTemplate = new RestTemplate();

    /**
     * 以get方式请求第三方http接口 getForEntity 不带参数
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
     * 以get方式请求第三方http接口 getForObject 参数替换
     * 模板中使用 {?} 来代表坑位，根据实际的传参顺序来填充
     * @return
     */
    @GetMapping("/v5/info")
    public User infoV5() {
        String url = "http://localhost:8081/user/v1/info?name={?}";
        return restTemplate.getForObject(url, User.class, "李四");
    }

    /**
     * 以get方式请求第三方http接口 getForObject 使用map传参
     * 模板中使用 {xx}, 而这个xx，对应的就是map中的key
     * @return
     */
    @GetMapping("/v6/info")
    public User infoV6() {
        String url = "http://localhost:8081/user/v1/info?name={name}";
        Map<String, Object> params = new HashMap<>();
        params.put("name", "王五");
        return restTemplate.getForObject(url, User.class, params);
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
     * 以post方式请求第三方http接口 postForEntity 参数通过表单
     * @return
     */
    @GetMapping("/v7/info")
    public User infoV7() {
        String url = "http://localhost:8081/user/v3/info";
        MultiValueMap<String, String> request = new LinkedMultiValueMap<>();
        request.add("name", "张三");
        ResponseEntity<User> responseEntity = restTemplate.postForEntity(url, request, User.class);
        return responseEntity.getBody();
    }

    /**
     * 以post方式请求第三方http接口 postForEntity 结合表单和url参数填充
     * @return
     */
    @GetMapping("/v8/info")
    public User infoV8() {
        String url = "http://localhost:8081/user/v3/info?age={?}";
        MultiValueMap<String, String> request = new LinkedMultiValueMap<>();
        request.add("name", "张三");
        ResponseEntity<User> responseEntity = restTemplate.postForEntity(url, request, User.class,20);
        return responseEntity.getBody();
    }

    /**
     * 以post方式请求第三方http接口 postForObject
     * @return
     */
    @GetMapping("/v3/info")
    public User infoV3() {
        String url = "http://localhost:8081/user/v2/info";
        User user = User.builder().name("小李").build();
        return  restTemplate.postForObject(url, user, User.class);
    }



    /**
     * 以get方式请求第三方http接口，并传入header
     * @return
     */
    @GetMapping("/v4/info")
    public User infoV4() {
        String url = "http://localhost:8081/user/v1/info";
        HttpHeaders resultRequestHeader = new HttpHeaders();
        resultRequestHeader.add("charset", "UTF-8");
        resultRequestHeader.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> resultHttpEntity = new HttpEntity<>(null, resultRequestHeader);
        ResponseEntity<User> exchange = restTemplate.exchange(url, HttpMethod.GET,resultHttpEntity,User.class);
        return exchange.getBody();
    }

    /**
     * 以get方式请求第三方http接口，并传入header
     * @return
     */
    @GetMapping("/v9/info")
    public User infoV9() {
        String url = "http://localhost:8081/user/v1/info";
        HttpHeaders resultRequestHeader = new HttpHeaders();
        resultRequestHeader.setContentType(MediaType.APPLICATION_JSON);

        JSONObject jsonObj = new JSONObject();
        jsonObj.put("start",1);
        jsonObj.put("page",5);

        HttpEntity<String> entity = new HttpEntity<>(jsonObj.toString(), resultRequestHeader);

        ResponseEntity<User> exchange = restTemplate.exchange(url, HttpMethod.GET,entity,User.class);
        return exchange.getBody();
    }
}
