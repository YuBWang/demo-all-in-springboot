package com.example.commonutil.limit;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class redissonCofig {
    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        String address = "redis://127.0.0.1:6379";
        config.useSingleServer()
                .setAddress(address);
        RedissonClient redissonClient = Redisson.create(config);
        return redissonClient;
    }
}
