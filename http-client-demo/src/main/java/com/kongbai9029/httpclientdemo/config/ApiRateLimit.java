package com.kongbai9029.httpclientdemo.config;

import org.redisson.api.*;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class ApiRateLimit {
    public final static String RATE_LIMIT_KEY = "messagesend_rate_limit_key";
    private final static String RATE_LOCK_KEY = "messagesend_rate_lock_key";
    private final static int REDIS_TIMEOUT_TIME = 5;
    // 每分钟生成 60 个令牌
    private final static int GEN_COUNT = 60;
    private final RedissonClient redissonClient;

    public ApiRateLimit(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        try {
            initRateLimiter();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            // 启动过程中被中断：保持中断标记即可
        }
    }

    private void initRateLimiter() throws InterruptedException {
        RLock rlock = redissonClient.getLock(RATE_LOCK_KEY);
        boolean locked = false;
        try {
            locked = rlock.tryLock(REDIS_TIMEOUT_TIME, TimeUnit.SECONDS);
            if (locked) {
                RRateLimiter rRateLimiter = redissonClient.getRateLimiter(RATE_LIMIT_KEY);
                rRateLimiter.setRate(RateType.OVERALL, GEN_COUNT, 1, RateIntervalUnit.MINUTES);
            }
        } finally {
            if (locked) {
                rlock.unlock();
            }
        }
    }
}
