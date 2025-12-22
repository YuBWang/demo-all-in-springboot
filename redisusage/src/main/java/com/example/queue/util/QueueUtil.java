package com.example.queue.util;



import com.alibaba.fastjson.JSONObject;

import com.example.queue.enums.QueueEnum;
import com.example.queue.manager.QueueManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * <p>标题： Redis队列工具类</p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2025</p>
 * <p>公司: 厦门象屿科技有限公司</p>
 * <p>创建日期：2025/11/14 11:01</p>
 * <p>类全名：cn.snsoft.component.redis.queue.util.QueueUtil</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
public class QueueUtil {
    private static final RedisTemplate<String, Object> redisTemplate = ApplicationContextUtil.getBean("redisTemplate");

    /**
     * 如果key不存在，则设置值并设置过期时间
     *
     * @param key           Redis key
     * @param value         要设置的值
     * @param expireSeconds 过期时间
     * @param timeUnit      时间单位
     * @return boolean
     */
    public static boolean setIfNotExist(String key, Object value, long expireSeconds, TimeUnit timeUnit) {
        if (!redisTemplate.hasKey(key)) {
            if (redisTemplate.opsForValue().setIfAbsent(key, value)) {
                redisTemplate.expire(key, expireSeconds, timeUnit);
                return true;
            }
        }
        return false;
    }

    /**
     * 删除多个key
     *
     * @param keys 要删除键
     */
    public static void batchDeleteKey(List<String> keys) {
        //删除多个 Key
        String luaScript = " for i = 1, #KEYS do " +
                "  redis.call('DEL', KEYS[i]) " +
                " end " +
                " return 1";
        DefaultRedisScript<Long> script = new DefaultRedisScript<>();
        script.setScriptText(luaScript);
        script.setResultType(Long.class);
        redisTemplate.execute(script, keys);
    }

    /**
     * 删除键
     *
     * @param key 钥匙
     */
    public static void deleteKey(String key) {
        redisTemplate.delete(key);
    }

    public static String getSalShipPushEbsKey(String lockSCode) {
        return "queue:sal_ship:push_ebs:" + lockSCode;
    }

    /**
     * 删除发货单推ebs分布式锁key
     *
     * @param ificode 接口内码
     */
    public static void deleteSalShipPushEbsKeyByLog(String ificode) {
        try {
            String scode = "";
            deleteSalShipPushEbsKeyBySCode(scode);
        } catch (Exception e) {
            //防止异常报错

        }
    }

    /**
     * 删除发货单推ebs分布式锁key
     *
     * @param scode 编码
     */
    public static void deleteSalShipPushEbsKeyBySCode(String scode) {
        String lockKey = getSalShipPushEbsKey(scode);
        //主动解锁
        deleteKey(lockKey);
    }

    /**
     * 设置发货单推ebs分布式锁key
     *
     * @param scode 仓库编码
     * @return boolean
     */
    public static boolean setSalShipPushEbsKey(String scode) {
        String lockKey = getSalShipPushEbsKey(scode);
        //ebs的处理时长大概在4分钟
        return setIfNotExist(lockKey, "1", 240, TimeUnit.SECONDS);
    }

    /**
     * 发送发货单推ebs队列
     *
     * @param wscode     接口编码
     * @param mainData   主要数据
     * @return boolean
     */
    public static boolean sendSalShipPushEbsQueue(String wscode, Map<String, Object> mainData, Map<String, Object> envParams) {
        //同个仓库下，EBS无法同时处理
        String scode = "";
        if (StringUtils.hasText(scode)) {
            //下个节点是61
            boolean flag = QueueUtil.setSalShipPushEbsKey(scode);
            if (flag) {
                //能拿到锁，说明不用进队列
                return false;
            }

            JSONObject jsonObject = new com.alibaba.fastjson.JSONObject();
            jsonObject.put("pushTargetStatus", "61");
            jsonObject.put("lockSCode", scode);
            jsonObject.put("wscode", wscode);
            QueueManager queueManager = new QueueManager(redisTemplate);
            //发送队列
            queueManager.sendMessage(QueueEnum.SHIP_PUSH_EBS_BY_C.getCode(), jsonObject);
            return true;
        }
        return false;
    }


    /**
     * 设置提货委托创建发货单分布式锁key
     *
     * @param corpbcode 公司
     * @param mdmid     客商
     * @return boolean
     */
    public static boolean setDeliveryCreateShipByCCKey(String corpbcode, String mdmid) {
        String lockKey = getDeliveryCreateShipByCCKey(corpbcode, mdmid);
        //发货单默认锁1分钟
        return setIfNotExist(lockKey, "1", 60, TimeUnit.SECONDS);
    }

    /**
     * 删除提货委托创建发货单分布式锁key
     *
     * @param corpbcode 公司
     * @param mdmid     客商
     */
    public static void deleteDeliveryCreateShipByCCKey(String corpbcode, String mdmid) {
        String lockKey = getDeliveryCreateShipByCCKey(corpbcode, mdmid);
        //主动解锁
        deleteKey(lockKey);
    }

    /**
     * 获取提货委托创建发货单分布式锁key
     *
     * @param corpbcode 公司
     * @param mdmid     客商
     */
    public static String getDeliveryCreateShipByCCKey(String corpbcode, String mdmid) {
        return QueueEnum.DELIVERY_CREATE_SHIP_BY_CC.getCode() + "_" + corpbcode + "_" + mdmid;
    }

    /**
     * 发送提货委托创建发货单队列
     *
     * @param corpbcode       公式
     * @param mdmid           客商
     * @param sourceicode     来源内码
     * @param sourcecode      来源单号
     * @param sourcesheetcode 来源单据号
     */
    public static void sendDeliveryCreateShipByCCQueue(String corpbcode, String mdmid, String sourceicode, String sourcecode,
                                                       String sourcesheetcode) {
        JSONObject jsonObject = new com.alibaba.fastjson.JSONObject();
        jsonObject.put("corpbcode", corpbcode);
        jsonObject.put("mdmid", mdmid);
        jsonObject.put("sourcecode", sourcecode);
        jsonObject.put("sourceicode", sourceicode);
        jsonObject.put("sourcesheetcode", sourcesheetcode);
        QueueManager queueManager = new QueueManager(redisTemplate);
        //发送队列
        String queueName = getDeliveryCreateShipByCCKey(corpbcode, mdmid);
        queueManager.sendMessage(queueName, jsonObject, 60, TimeUnit.SECONDS);

    }

    /**
     * 标记当前队列是否在消费
     *
     * @param queueConsumerRunningKey 队列消费标识
     * @return boolean
     */
    public static boolean setQueueConsumerRunningKey(String queueConsumerRunningKey, long expireSeconds, TimeUnit timeUnit) {
        return setIfNotExist(queueConsumerRunningKey, "1", expireSeconds, timeUnit);
    }

    /**
     * 删除队列消费标记
     *
     * @param queueConsumerRunningKey 队列消费标识
     */
    public static void deleteQueueConsumerRunningKey(String queueConsumerRunningKey) {
        //主动解锁
        deleteKey(queueConsumerRunningKey);
    }
}
