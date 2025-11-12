package com.example.redisusage.service;

import com.example.redisusage.util.RedisUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    @Autowired
    private RedisUtil redisUtil;

    @PostConstruct
    public void testRedis() {
        try {
            // 测试添加缓存
            boolean setResult = redisUtil.set("name", "张三");
            if (setResult) {
                System.out.println("设置name值为: 张三");
            } else {
                System.out.println("设置name值失败");
                return;
            }

            // 测试获取缓存
//            String name = (String) redisUtil.get("name");
//            System.out.println("获取name值为: " + name);
//
//            // 测试删除缓存
//            boolean deleteResult = redisUtil.delete("name");
//            if (deleteResult) {
//                System.out.println("删除name键成功");
//            } else {
//                System.out.println("删除name键失败");
//            }
//
//            // 再次获取验证是否删除
//            Object result = redisUtil.get("name");
//            System.out.println("删除后获取name值为: " + result);
        } catch (RedisConnectionFailureException e) {
            System.err.println("Redis连接失败，请确保Redis服务器正在运行: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("测试过程中发生错误: " + e.getMessage());
            e.printStackTrace();
        }
    }
}