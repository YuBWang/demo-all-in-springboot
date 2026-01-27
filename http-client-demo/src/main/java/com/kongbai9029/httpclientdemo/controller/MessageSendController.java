package com.kongbai9029.httpclientdemo.controller;

import com.kongbai9029.httpclientdemo.config.ApiRateLimit;
import com.kongbai9029.httpclientdemo.model.*;
import com.kongbai9029.httpclientdemo.util.RestTemplateUtil;
import org.redisson.api.RRateLimiter;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("message")
public class MessageSendController
{
    // 最长等待 60s 获取令牌（阻塞式获取，无需手写循环）
    private static final long RATE_WAIT_MILLIS = 300000L;

    @Autowired
    private RestTemplateUtil restUtil;
    @Autowired
    private RedissonClient redissonClient;

    @PostMapping("getToken")
    public String getToken(@RequestBody TokenRequestParam param) {
        RRateLimiter rateLimiter = redissonClient.getRateLimiter(ApiRateLimit.RATE_LIMIT_KEY);
        if (rateLimiter.tryAcquire()) {
            String url = "https://api.dingtalk.com/v1.0/oauth2/accessToken";
            TokenDto response =restUtil.post(url,param, TokenDto.class);
            return response.getAccessToken();
        }
        return null;
    }

    @PostMapping("sendmessage")
    public String sendMessage(@RequestBody CardRequestV2 cardRequestV2) {
        RRateLimiter rateLimiter = redissonClient.getRateLimiter(ApiRateLimit.RATE_LIMIT_KEY);
        // 阻塞等待令牌，超时则抛业务异常
        if (!rateLimiter.tryAcquire(1, RATE_WAIT_MILLIS, TimeUnit.MILLISECONDS)) {
            throw new IllegalStateException("超过限流阈值，请稍后重试");
        }

        String url = "https://api.dingtalk.com/v1.0/card/instances/createAndDeliver";
          HttpHeaders httpHeaders = new HttpHeaders();
          httpHeaders.add("x-acs-dingtalk-access-token", "76bd2b9565f73c1ea43c976fdf31f42b");
        CardDeliverResponse resultParamsDTO = restUtil.post(url,cardRequestV2,httpHeaders,CardDeliverResponse.class);
          return resultParamsDTO.getResult().getDeliverResults().get(0).getCarrierId();
    }

}
