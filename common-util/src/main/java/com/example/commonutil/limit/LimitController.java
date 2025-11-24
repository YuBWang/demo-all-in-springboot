package com.example.commonutil.limit;

import org.redisson.api.RRateLimiter;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LimitController {

    @Autowired
    private RedissonClient redissonClient;

    @GetMapping("/limittest")
    public String test() {
        RRateLimiter rateLimiter = redissonClient.getRateLimiter(ApiRateLimit.RATE_LIMIT_KEY);
        if (rateLimiter.tryAcquire()) {
            System.out.println("成功");
            return "成功";
        } else {
            System.out.println("失败");
            return "失败";
        }
    }
}
