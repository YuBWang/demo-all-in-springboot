package com.kongbai9029.httpclientdemo.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.kongbai9029.httpclientdemo.model.User;
import okhttp3.*;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * @Author: wyb
 * @Date: 2022/1/13 17:06
 */
@RestController
@RequestMapping("okhttp")
public class OkHttpController {
    /**
     * 使用OkHttp发送请求主要分为一下几步骤：
     *
     * 创建OkHttpClient对象
     * 创建Request对象
     * 将Request 对象封装为Call
     * 通过Call 来执行同步或异步请求，调用execute方法同步执行，调用enqueue方法异步执行
     */

    private OkHttpClient client = new OkHttpClient();

    @GetMapping("/v1/info")
    public User infoV1() throws IOException {
        String url = "http://localhost:8081/user/v1/info";
        Request request = new Request.Builder()
                .url(url)
                .get()
                .build();
        final Call call = client.newCall(request);
        Response response = call.execute();
        return JSON.parseObject(response.body().string(), User.class);
    }

    @GetMapping("/v2/info")
    public User infoV2() throws IOException {
        String url = "http://localhost:8081/user/v2/info";
        //请求参数
        JSONObject json = new JSONObject();
        json.put("name", "hetiantian");
        RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"),     String.valueOf(json));
        Request request = new Request.Builder()
                .url(url)
                .post(requestBody) //post请求
                .build();
        final Call call = client.newCall(request);
        Response response = call.execute();
        return JSON.parseObject(response.body().string(), User.class);
    }

}
