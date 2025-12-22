package com.example.redisusage.service;

import com.example.redisusage.util.RedisMapUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TestMapService {

    @Autowired
    private RedisMapUtil redisMapUtil;

    @PostConstruct
    public void testRedisMap() {
        try {
            String key = "user:1001";
            
            // 准备测试数据
            Map<String, Object> userData = new HashMap<>();
            userData.put("name", "张三");
            userData.put("age", 25);
            userData.put("email", "zhangsan@example.com");
            userData.put("score", 95.5);
            
            // 测试添加整个Map
            boolean putAllResult = redisMapUtil.putAll(key, userData);
            if (putAllResult) {
                System.out.println("成功添加用户信息到Redis Map");
            } else {
                System.out.println("添加用户信息到Redis Map失败");
                return;
            }
            
            // 测试添加单个字段
            redisMapUtil.put(key, "address", "北京市朝阳区");
            System.out.println("添加地址信息");
            
            // 测试获取单个字段
            String name = (String) redisMapUtil.get(key, "name");
            System.out.println("获取用户姓名: " + name);
            
            // 测试获取整个Map
            Map<Object, Object> userMap = redisMapUtil.getMap(key);
            System.out.println("获取完整用户信息: " + userMap);
            
            // 测试获取Map大小
            long size = redisMapUtil.size(key);
            System.out.println("用户信息字段数量: " + size);
            
            // 测试数值增加
            redisMapUtil.increment(key, "age", 1);
            redisMapUtil.increment(key, "score", 2.5);
            
            // 验证数值增加结果
            Integer newAge = (Integer) redisMapUtil.get(key, "age");
//            Double newScore = (Double) redisMapUtil.get(key, "score");
//            System.out.println("增加后的年龄: " + newAge);
//            System.out.println("增加后的分数: " + newScore);
//
//            // 测试删除字段
//            long deleteCount = redisMapUtil.deleteFields(key, "email");
//            System.out.println("删除字段数量: " + deleteCount);
//
//            // 验证删除结果
//            boolean hasEmail = redisMapUtil.hasKey(key, "email");
//            System.out.println("是否还有email字段: " + hasEmail);
//
//            // 获取更新后的Map
//            Map<Object, Object> updatedUserMap = redisMapUtil.getMap(key);
//            System.out.println("更新后的用户信息: " + updatedUserMap);
//
//            // 设置过期时间
//            redisMapUtil.expire(key, 300); // 5分钟
//            long expireTime = redisMapUtil.getExpire(key);
//            System.out.println("过期时间: " + expireTime + "秒");
            
        } catch (RedisConnectionFailureException e) {
            System.err.println("Redis连接失败，请确保Redis服务器正在运行: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("测试过程中发生错误: " + e.getMessage());
            e.printStackTrace();
        }
    }
}