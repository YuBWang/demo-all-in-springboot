package com.kongbai9029.httpclientdemo.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.kongbai9029.httpclientdemo.model.User;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * @Author: wyb
 * @Date: 2022/1/13 15:22
 */
@RestController
@RequestMapping("httpclient")
public class HttpClientController {
    /**
     * 使用HttpClient发送请求主要分为一下几步骤：
     *
     * 创建 CloseableHttpClient对象或CloseableHttpAsyncClient对象，前者同步，后者为异步
     * 创建Http请求对象
     * 调用execute方法执行请求，如果是异步请求在执行之前需调用start方法
     */
    private CloseableHttpClient httpClient = HttpClientBuilder.create().build();

    @GetMapping("/v1/info")
    public User infoV1() throws IOException {
        String url = "http://localhost:8081/user/v1/info";
        HttpGet httpGet = new HttpGet(url);
        CloseableHttpResponse response = httpClient.execute(httpGet);
        return JSON.parseObject(EntityUtils.toString(response.getEntity()), User.class);
    }

    @GetMapping("/v2/info")
    public User infoV2() throws IOException {
        String url = "http://localhost:8081/user/v2/info";
        HttpPost httpPost = new HttpPost(url);
        User user = User.builder().name("小李").build();
        httpPost.setHeader("Content-Type", "application/json;charset=utf8");
        httpPost.setEntity(new StringEntity(JSONObject.toJSONString(user), "UTF-8"));
        CloseableHttpResponse response = httpClient.execute(httpPost);
        return JSON.parseObject(EntityUtils.toString(response.getEntity()), User.class);
    }

}
