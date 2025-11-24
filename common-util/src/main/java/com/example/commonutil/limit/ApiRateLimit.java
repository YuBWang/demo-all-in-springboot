package com.example.commonutil.limit;

import org.redisson.api.*;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class ApiRateLimit {
    public final static String RATE_LIMIT_KEY = "rate_limit_key";
    private final static String RATE_LOCK_KEY = "rate_lock_key";
    private final static int REDIS_TIMEOUT_TIME = 5;
    private final static int GEN_COUNT = 10;
    private RedissonClient redissonClient;

    public ApiRateLimit(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    public void init() throws InterruptedException {
        RLock rlock = redissonClient.getLock(RATE_LOCK_KEY);
        try {
            if (rlock.tryLock(REDIS_TIMEOUT_TIME, TimeUnit.SECONDS)) {
                RRateLimiter rRateLimiter = redissonClient.getRateLimiter(RATE_LIMIT_KEY);
                rRateLimiter.setRate(RateType.OVERALL, GEN_COUNT, 1, RateIntervalUnit.MINUTES);
            }
        } finally {
            rlock.unlock();
        }
    }
}
