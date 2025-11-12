package com.example.redisusage.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class RedisMapUtil {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 向Map中添加键值对
     *
     * @param key   Redis键
     * @param field Map中的字段
     * @param value 字段值
     * @return 添加结果
     */
    public boolean put(String key, String field, Object value) {
        try {
            redisTemplate.opsForHash().put(key, field, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 向Map中添加多个键值对
     *
     * @param key Redis键
     * @param map 包含多个键值对的Map
     * @return 添加结果
     */
    public boolean putAll(String key, Map<String, Object> map) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 获取Map中指定字段的值
     *
     * @param key   Redis键
     * @param field Map中的字段
     * @return 字段值
     */
    public Object get(String key, String field) {
        try {
            return redisTemplate.opsForHash().get(key, field);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获取整个Map
     *
     * @param key Redis键
     * @return Map对象
     */
    public Map<Object, Object> getMap(String key) {
        try {
            return redisTemplate.opsForHash().entries(key);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获取Map中所有字段
     *
     * @param key Redis键
     * @return 字段集合
     */
    public Set<Object> getFields(String key) {
        try {
            return redisTemplate.opsForHash().keys(key);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获取Map中所有值
     *
     * @param key Redis键
     * @return 值集合
     */
    public List<Object> getValues(String key) {
        try {
            return redisTemplate.opsForHash().values(key);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 删除Map中的字段
     *
     * @param key    Redis键
     * @param fields 要删除的字段
     * @return 删除的字段数量
     */
    public long deleteFields(String key, Object... fields) {
        try {
            return redisTemplate.opsForHash().delete(key, fields);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 判断Map中是否存在指定字段
     *
     * @param key   Redis键
     * @param field 字段名
     * @return 是否存在
     */
    public boolean hasKey(String key, String field) {
        try {
            return redisTemplate.opsForHash().hasKey(key, field);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 获取Map的大小
     *
     * @param key Redis键
     * @return Map大小
     */
    public long size(String key) {
        try {
            return redisTemplate.opsForHash().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 为Map中的数值型字段增加值
     *
     * @param key   Redis键
     * @param field 字段名
     * @param delta 增加的值
     * @return 增加后的值
     */
    public double increment(String key, String field, double delta) {
        try {
            return redisTemplate.opsForHash().increment(key, field, delta);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 为Map中的数值型字段增加整数值
     *
     * @param key   Redis键
     * @param field 字段名
     * @param delta 增加的值
     * @return 增加后的值
     */
    public long increment(String key, String field, long delta) {
        try {
            return redisTemplate.opsForHash().increment(key, field, delta);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 设置Map的过期时间
     *
     * @param key  Redis键
     * @param time 过期时间（秒）
     * @return 设置结果
     */
    public boolean expire(String key, long time) {
        try {
            if (time > 0) {
                redisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 获取Map的过期时间
     *
     * @param key Redis键
     * @return 过期时间（秒）
     */
    public long getExpire(String key) {
        try {
            return redisTemplate.getExpire(key, TimeUnit.SECONDS);
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }
}