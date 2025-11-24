package com.example.commonutil.limit;

import com.google.common.util.concurrent.RateLimiter;

public class GuavaRateLimit {
    RateLimiter rateLimiter = RateLimiter.create(10);
    public void doSomething() throws InterruptedException {
        if (rateLimiter.tryAcquire()) {
            System.out.println("do something");
            Thread.sleep(500);
        } else {
            System.out.println("too many requests");
        }
    }

    public static void main(String[] args) throws InterruptedException {
        GuavaRateLimit guavaRateLimit = new GuavaRateLimit();
        Thread.sleep(2000);
        for (int i = 0; i < 100; i++) {
            if (i%20 == 0) {
                Thread.sleep(2000);
            }
            new Thread(() -> {
                try {
                    guavaRateLimit.doSomething();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}

