package com.example.queue.manager;

import com.example.queue.model.QueueMessage;
import com.example.queue.model.QueueStats;
import com.alibaba.fastjson.JSONObject;
import com.example.queue.util.QueueUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.util.StringUtils;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * <p>标题： Redis队列消息管理</p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2025</p>
 * <p>公司: </p>
 * <p>创建日期：2025/11/12 15:56</p>
 * <p>类全名：com.example.queue.manager.QueueManager</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */

public class QueueManager {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    /**
     * 等待队列
     */
    public static final String QUEUE_WAITING = "queue:waiting:";
    /**
     * 处理中队列
     */
    public static final String QUEUE_PROCESSING = "queue:processing:";
    /**
     * 延迟队列
     */
    public static final String QUEUE_DELAYED = "queue:delayed:";
    /**
     * 死信队列
     */
    public static final String QUEUE_DEAD_LETTER = "queue:dead_letter:";
    public static final String QUEUE_RETRY_COUNT = "queue:retry_count:";

    /**
     * 标记当前队列是否在消费
     */
    public static final String QUEUE_CONSUMER_RUNNING = "queue:consumer:running:";

    /**
     * 执行状态（延迟队列默认状态也为等待中）
     * waiting:等待中;processing:执行中;dead_letter:异常;success:成功;delete:作废
     */
    public static final String QUEUE_STATUS_WAITING = "waiting";
    public static final String QUEUE_STATUS_PROCESSING = "processing";
    public static final String QUEUE_STATUS_SUCCESS = "success";
    public static final String QUEUE_STATUS_DEAD_LETTER = "dead_letter";
    public static final String QUEUE_STATUS_DEAD_DELETE = "delete";

    /**
     * 记录所有的队列名称
     */
    public static final String QUEUES = "queue:all_queues";

    public ListOperations<String, Object> opsForList;

    public ZSetOperations<String, Object> opsForZSet;

    public SetOperations<String, Object> opsForSet;

    public HashOperations<String, Object, Object> opsForHash;

    public QueueManager(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = new ObjectMapper();
        this.opsForList = this.redisTemplate.opsForList();
        this.opsForZSet = this.redisTemplate.opsForZSet();
        this.opsForSet = this.redisTemplate.opsForSet();
        this.opsForHash = this.redisTemplate.opsForHash();
    }

    /**
     * 发送消息到队列
     * message中尽量传递以下参数：
     * sourcecode:来源单号
     * sourceicode:来源内码
     * sourcesheetcode:来源单据号
     */
    public void sendMessage(String queueName, JSONObject message) {
        sendMessage(queueName, message, 0, TimeUnit.SECONDS);
    }

    /**
     * 发送延迟消息
     * message中尽量传递以下参数：
     * sourcecode:来源单号
     * sourceicode:来源内码
     * sourcesheetcode:来源单据号
     */
    public void sendMessage(String queueName, JSONObject message, long delay, TimeUnit timeUnit) {
        QueueMessage queueMessage = new QueueMessage(message);
        String messageJson = writeValueAsString(queueMessage);
        String waitingQueueKey = getWaitingQueueKey(queueName);

        Map<String, Object> insertMap = new HashMap<>();
        if (delay <= 0) {
            // 立即发送 使用 rightPush + leftPop 实现标准FIFO队列
            opsForList.rightPush(waitingQueueKey, messageJson);
            insertMap.put("is_delay", "N");
        } else {
            // 延迟发送 指定消息应该在什么时间被投递到等待队列
            long delayMillis = timeUnit.toMillis(delay);
            long deliverTime = System.currentTimeMillis() + delayMillis;
            //使用Zet将执行时间设置成分数 ZSet会根据分数自动维护消息的时序
//                发送延迟消息时，调用此方法将消息存入延迟队列
//                消费者在接收消息时，会检查延迟队列中是否有到期的消息
//                使用 rangeByScore 查询当前时间之前的所有消息
//                将到期的消息转移到等待队列中等待处理
            // Zset有序 元素唯一但是分数可重复，SET无序，不可重复
            opsForZSet.add(getDelayedQueueKey(queueName), messageJson, deliverTime);
            insertMap.put("is_delay", "Y");
            insertMap.put("delay_millis", String.valueOf(delayMillis));
        }
        //记录当前队列名称，用于处理超时队列时获取
        opsForSet.add(QUEUES, queueName);

        //记录日志
        addMqRecord(queueName, messageJson, queueMessage, insertMap);
    }

    /**
     * 接收消息（阻塞）
     */
    public QueueMessage receiveMessage(String queueName, long timeout, TimeUnit timeUnit) {
        try {
            // 先处理延迟消息
            processDelayedMessages(queueName);

            String waitingQueueKey = getWaitingQueueKey(queueName);
            String processingQueueKey = getProcessingQueueKey(queueName);

            // 从等待中队列移除
            Object messageJson;
            if (timeout > 0) {
                // 阻塞获取
                messageJson = opsForList.leftPop(waitingQueueKey, timeout, timeUnit);
            } else {
                // 非阻塞获取
                messageJson = opsForList.leftPop(waitingQueueKey);
            }

            if (messageJson == null) {
                return null;
            }


            QueueMessage queueMessage = parseMessage(messageJson);
            queueMessage.setStartProcessTime(System.currentTimeMillis());

            String processingMessageJson = writeValueAsString(queueMessage);
            // 将消息移动到处理中队列
            opsForList.rightPush(processingQueueKey, processingMessageJson);

            //记录日志
            String messageId = queueMessage.getId();
            updateMqRecord(messageId, QUEUE_STATUS_PROCESSING, new HashMap<>());
            return queueMessage;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("消息反序列化失败", e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String writeValueAsString(QueueMessage message) {
        String messageJson;
        try {
            messageJson = objectMapper.writeValueAsString(message);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("消息序列化失败", e);
        }
        return messageJson;
    }

    /**
     * 更新MQ记录
     *
     * @param messageId 消息ID
     * @param status    状态
     * @param otherMap  其他参数
     */
    public void updateMqRecord(String messageId, String status, Map<String, Object> otherMap) {

    }

    /**
     * 批量更新MQ记录状态
     *
     * @param messageIds 消息ID
     * @param status     状态
     */
    public void batchUpdateMqRecordStatus(Set<String> messageIds, String status) {
    }

    /**
     * 新增MQ记录
     *
     * @param queueName    队列名称
     * @param messageJson  参数
     * @param queueMessage 消息参数
     */
    public void addMqRecord(String queueName, String messageJson, QueueMessage queueMessage, Map<String, Object> insertMap) {
        try {
            String messageId = queueMessage.getId();
            JSONObject data = queueMessage.getData();
            insertMap.put("id", messageId);
            insertMap.put("receivetime", new Date());
            insertMap.put("queuecode", queueName);
            insertMap.put("params", objectMapper.writeValueAsString(data));
            insertMap.put("status", "waiting");
            insertMap.put("sourcecode", data.get("sourcecode"));
            insertMap.put("sourceicode", data.get("sourceicode"));
            insertMap.put("sourcesheetcode", data.get("sourcesheetcode"));
            //todo 将数据保存到中间记录表

        } catch (Exception e) {

        }
    }

    /**
     * 确认消息处理完成
     */
    public void acknowledge(String queueName, QueueMessage message) {
        String processingQueueKey = getProcessingQueueKey(queueName);
        String retryCountKey = getRetryCountKey(queueName);

        //使用Lua原子性地删除消息和重试计数
        String messageJson = writeValueAsString(message);
        DefaultRedisScript<Long> script = getAcknowledgeRedisScript();

        Long result = redisTemplate.execute(script, Arrays.asList(processingQueueKey, retryCountKey), message.getId(), messageJson);

    }

    /**
     * 获取lua脚本
     * 删除执行中队列 并清除重试次数
     *
     * @return {@link DefaultRedisScript }<{@link Long }>
     */
    public static DefaultRedisScript<Long> getAcknowledgeRedisScript() {
        String luaScript = "local processingQueue = KEYS[1] " +
                " local retryCountKey = KEYS[2] " +
                " local messageId = ARGV[1]" +
                " local message = ARGV[2]" +
                " redis.call('lrem', processingQueue, 1, message) " +
                " redis.call('hdel', retryCountKey, messageId) " +
                " return 1";

        DefaultRedisScript<Long> script = new DefaultRedisScript<>();
        script.setScriptText(luaScript);
        script.setResultType(Long.class);
        return script;
    }

    /**
     * 处理超时消息
     */
    public void processTimeOutMessages(String queueName, long timeoutMillis, int maxRetries) {
        String processingQueueKey = getProcessingQueueKey(queueName);
        String waitingQueueKey = getWaitingQueueKey(queueName);

        long currentTime = System.currentTimeMillis();
        long cutoffTime = currentTime - timeoutMillis;

        // 0 到 -1 表示获取列表中的所有元素
        List<Object> processingMessages = opsForList.range(processingQueueKey, 0, -1);

        if (processingMessages == null || processingMessages.isEmpty()) {
            return;
        }

        for (Object messageJson : processingMessages) {
            String messageId = "";
            try {
                QueueMessage message = parseMessage(messageJson);
                messageId = message.getId();
                if (message.getStartProcessTime() < cutoffTime) {
                    //消息超时
                    int retryCount = getRetryCount(queueName, message.getId());

                    if (retryCount >= maxRetries) {
                        //超过最大重试次数，移动到死信队列
                        moveToDeadLetter(queueName, messageJson, messageId, null,null, "超过最大重试次数");
                    } else {
                        //重新放入等待队列
                        incrementRetryCount(queueName, message.getId());
                        //从处理中队列移除
                        opsForList.remove(processingQueueKey, 1, messageJson);

                        message.setStartProcessTime(null);
                        String updatedMessageJson = writeValueAsString(message);

                        opsForList.rightPush(waitingQueueKey, updatedMessageJson);
                        //updateMqRecord(messageId, QUEUE_STATUS_WAITING, MapUtil.toHashMap("excutetime", null));
                    }
                }
            } catch (IOException e) {
                //消息格式错误，移动到死信队列
                moveToDeadLetter(queueName, messageJson, messageId, null, null, e.getMessage());
            }
        }
    }

    /**
     * 获取队列统计信息
     */
    public QueueStats getQueueStats(String queueName) {
        //等待队列
        Long waitingCount = opsForList.size(getWaitingQueueKey(queueName));
        //执行中队列
        Long processingCount = opsForList.size(getProcessingQueueKey(queueName));
        //死信队列
        Long deadLetterCount = opsForList.size(getDeadLetterQueueKey(queueName));
        //延迟队列
        Long delayedCount = opsForZSet.size(getDelayedQueueKey(queueName));

        return new QueueStats(waitingCount != null ? waitingCount : 0, processingCount != null ? processingCount : 0, deadLetterCount != null ? deadLetterCount : 0, delayedCount != null ? delayedCount : 0);
    }

    /**
     * 处理延迟消息
     *
     * @param queueName 队列名称
     */
    public void processDelayedMessages(String queueName) {
        String delayedQueueKey = getDelayedQueueKey(queueName);
        String waitingQueueKey = getWaitingQueueKey(queueName);
        long currentTime = System.currentTimeMillis();

        //当前时间是否已到延迟队列执行时间  分数在 0 到当前时间之间的所有元素
        Set<Object> readyMessages = opsForZSet.rangeByScore(delayedQueueKey, 0, currentTime);

        if (readyMessages != null && !readyMessages.isEmpty()) {
            for (Object messageJson : readyMessages) {
                //移动到等待队列，并从延迟队列中移除
                opsForList.rightPush(waitingQueueKey, messageJson);
                opsForZSet.remove(delayedQueueKey, messageJson);
            }
        }
    }

    /**
     * 消息序列化
     *
     * @param messageJson 消息 JSON
     * @return {@link QueueMessage }
     * @throws IOException ioexception
     */
    public QueueMessage parseMessage(Object messageJson) throws IOException {
        // 将存储在Redis中的JSON字符串转换回Java对
        return objectMapper.readValue(String.valueOf(messageJson), QueueMessage.class);
    }

    /**
     * 移至死信队列
     *
     * @param queueName   队列名称
     * @param messageJson 消息 JSON
     */
    public void moveToDeadLetter(String queueName, Object messageJson, String messageId, String handlerClassName, String poolName, String msg) {
        String deadLetterQueueKey = getDeadLetterQueueKey(queueName);
        String waitingQueueKey = getWaitingQueueKey(queueName);
        String processingQueueKey = getProcessingQueueKey(queueName);
        opsForList.rightPush(deadLetterQueueKey, messageJson);
        opsForList.remove(waitingQueueKey, 1, messageJson);
        opsForList.remove(processingQueueKey, 1, messageJson);
        if (!StringUtils.hasText(messageId)) {
            return;
        }
        Map<String, Object> upMap = new HashMap<>();
        if (StringUtils.hasText(handlerClassName)) {
            upMap.put("handlername", handlerClassName);
        }
        upMap.put("excutetime", new Date());
        upMap.put("msg", msg);
        upMap.put("poolname", poolName);
        updateMqRecord(messageId, QUEUE_STATUS_DEAD_LETTER, upMap);
    }

    /**
     * 移至等待队列
     *
     * @param queueName   队列名称
     * @param messageJson 消息 JSON
     */
    public void moveToWaiting(String queueName, Object messageJson, Object updateMessageJson, String messageId, String handlerClassName) {
        String deadLetterQueueKey = getDeadLetterQueueKey(queueName);
        String waitingQueueKey = getWaitingQueueKey(queueName);
        String processingQueueKey = getProcessingQueueKey(queueName);
        opsForList.remove(deadLetterQueueKey, 1, messageJson);
        opsForList.remove(processingQueueKey, 1, messageJson);
        opsForList.rightPush(waitingQueueKey, updateMessageJson);
        if (!StringUtils.hasText(messageId)) {
            return;
        }
        Map<String, Object> upMap = new HashMap<>();
        if (StringUtils.hasText(handlerClassName)) {
            upMap.put("handlername", handlerClassName);
        }
        upMap.put("excutetime", null);
        updateMqRecord(messageId, QUEUE_STATUS_WAITING, upMap);
    }

    /**
     * 获取重试次数
     *
     * @param queueName 队列名称
     * @param messageId 消息 ID
     * @return int
     */
    public int getRetryCount(String queueName, String messageId) {
        String retryCountKey = getRetryCountKey(queueName);
        Object count = opsForHash.get(retryCountKey, messageId);
        return count != null ? Integer.parseInt(count.toString()) : 0;
    }

    /**
     * 获取所有队列名称
     *
     * @return {@link Set }<{@link String }>
     */
    public Set<String> getAllQueueName() {
        Set<String> set = new HashSet<>();
        Set<Object> queues = opsForSet.members(QUEUES);
        if (!CollectionUtils.isEmpty(queues)) {
            for (Object s : queues) {
                set.add(String.valueOf(s));
            }
        }
        return set;
    }

    /**
     * 获取队列消息
     *
     * @param queueName 队列名称
     * @return {@link Map }<{@link String }, {@link List }<{@link QueueMessage }>>
     */
    public Map<String, List<QueueMessage>> getQueueMessages(String queueName) {
        Map<String, List<QueueMessage>> queueMessageMap = new HashMap<>();
        List<QueueMessage> processingList = getProcessingMessage(queueName);
        List<QueueMessage> waitingList = getWaitingMessage(queueName);
        List<QueueMessage> deadLetterList = getDeadLetterMessage(queueName);
        List<QueueMessage> delayedList = getDelayedMessage(queueName);

        queueMessageMap.put("processingList", processingList);
        queueMessageMap.put("waitingList", waitingList);
        queueMessageMap.put("deadLetterList", deadLetterList);
        queueMessageMap.put("delayedList", delayedList);
        return queueMessageMap;
    }

    /**
     * 获取延迟消息
     *
     * @param queueName 队列名称
     * @return {@link List }<{@link QueueMessage }>
     */
    public List<QueueMessage> getDelayedMessage(String queueName) {
        String delayedQueueKey = getDelayedQueueKey(queueName);
        List<QueueMessage> delayedList = new ArrayList<>();
        Set<Object> readyMessages = opsForZSet.range(delayedQueueKey, 0, -1);
        if (readyMessages != null && !readyMessages.isEmpty()) {
            List<Object> parseMessages = new ArrayList<>(readyMessages);
            parseMessage(parseMessages, delayedList);
        }
        return delayedList;

    }

    /**
     * 获取执行中消息
     *
     * @param queueName 队列名称
     * @return {@link List }<{@link QueueMessage }>
     */
    public List<QueueMessage> getProcessingMessage(String queueName) {
        String processingQueueKey = getProcessingQueueKey(queueName);
        List<QueueMessage> processingList = new ArrayList<>();
        List<Object> processingMessages = opsForList.range(processingQueueKey, 0, -1);
        parseMessage(processingMessages, processingList);
        return processingList;

    }

    /**
     * 获取等待消息
     *
     * @param queueName 队列名称
     * @return {@link List }<{@link QueueMessage }>
     */
    public List<QueueMessage> getWaitingMessage(String queueName) {
        String waitingQueueKey = getWaitingQueueKey(queueName);
        List<QueueMessage> waitingList = new ArrayList<>();
        List<Object> waitingMessages = opsForList.range(waitingQueueKey, 0, -1);
        parseMessage(waitingMessages, waitingList);
        return waitingList;

    }

    /**
     * 获取死信消息
     *
     * @param queueName 队列名称
     * @return {@link List }<{@link QueueMessage }>
     */
    public List<QueueMessage> getDeadLetterMessage(String queueName) {
        String deadLetterQueueKey = getDeadLetterQueueKey(queueName);
        List<QueueMessage> deadLetterList = new ArrayList<>();
        List<Object> deadLetterMessages = opsForList.range(deadLetterQueueKey, 0, -1);
        parseMessage(deadLetterMessages, deadLetterList);
        return deadLetterList;

    }

    public void parseMessage(List<Object> parseMessages, List<QueueMessage> targetList) {
        for (Object messageJson : parseMessages) {
            try {
                QueueMessage message = parseMessage(messageJson);
                targetList.add(message);
            } catch (IOException e) {

            }
        }
    }

    /**
     * 删除队列
     *
     * @param queueName 队列名称
     */
    public void deleteQueue(String queueName) {
        String processingQueueKey = getProcessingQueueKey(queueName);
        String waitingQueueKey = getWaitingQueueKey(queueName);
        String deadLetterQueueKey = getDeadLetterQueueKey(queueName);
        String retryCountKey = getRetryCountKey(queueName);
        String delayedQueueKey = getDelayedQueueKey(queueName);
        List<String> keys = new ArrayList<>();
        keys.add(processingQueueKey);
        keys.add(waitingQueueKey);
        keys.add(delayedQueueKey);
        keys.add(deadLetterQueueKey);
        keys.add(retryCountKey);
        List<String> processingMess = getMessageIds(processingQueueKey);
        List<String> waitingMess = getMessageIds(waitingQueueKey);
        List<String> deadLetterMess = getMessageIds(deadLetterQueueKey);
        List<String> delayedMess = getMessageIds(delayedQueueKey);

        Set<String> ids = new HashSet<>();
        ids.addAll(processingMess);
        ids.addAll(waitingMess);
        ids.addAll(deadLetterMess);
        ids.addAll(delayedMess);
        QueueUtil.batchDeleteKey(keys);
        //将队列名称从所有队列中移除
        opsForSet.remove(QUEUES, queueName);

        if (!ids.isEmpty()) {
            batchUpdateMqRecordStatus(ids, QUEUE_STATUS_DEAD_DELETE);
        }

    }

    /**
     * 获取消息ID
     *
     * @param key 钥匙
     * @return {@link List }<{@link String }>
     */
    public List<String> getMessageIds(String key) {
        List<String> messageIds = new ArrayList<>();
        List<Object> processingMessages = opsForList.range(key, 0, -1);

        if (processingMessages == null || processingMessages.isEmpty()) {
            return messageIds;
        }

        for (Object messageJson : processingMessages) {
            try {
                QueueMessage message = parseMessage(messageJson);
                if (message != null) {
                    messageIds.add(message.getId());
                }
            } catch (IOException e) {

            }
        }

        return messageIds;
    }

    /**
     * 获取队列名称中前缀为xx的值（因为序列号问题，无法使用scan命令）
     */
    public Set<String> getQueueNamesByPrefix(String prefix) {
        Set<Object> allMembers = opsForSet.members(QUEUES);
        Set<String> result = new HashSet<>();

        if (!CollectionUtils.isEmpty(allMembers)) {
            for (Object member : allMembers) {
                String string = String.valueOf(member);
                if (string.startsWith(prefix)) {
                    result.add(string);
                }
            }
        }
        return result;
    }

    /**
     * 获取数量
     */
    public int countQueueNamesByPrefix(String prefix) {
        Set<String> values = getQueueNamesByPrefix(prefix);
        return values.size();
    }

    /**
     * 清空执行中队列
     *
     * @param queueName 队列名称
     */
    public void clearProcessingQueue(String queueName) {
        String queueKey = getProcessingQueueKey(queueName);
        List<String> messageIds = getMessageIds(queueKey);
        redisTemplate.delete(queueKey);
        Set<String> ids = new HashSet<>(messageIds);
        if (!ids.isEmpty()) {
            batchUpdateMqRecordStatus(ids, "delete");
        }
    }

    /**
     * 清空等待中队列
     *
     * @param queueName 队列名称
     */
    public void clearWaitingQueue(String queueName) {
        String queueKey = getWaitingQueueKey(queueName);
        List<String> messageIds = getMessageIds(queueKey);
        redisTemplate.delete(queueKey);
        Set<String> ids = new HashSet<>(messageIds);
        if (!ids.isEmpty()) {
            batchUpdateMqRecordStatus(ids, "delete");
        }
    }

    /**
     * 清空死信队列
     *
     * @param queueName 队列名称
     */
    public void clearDeadLetterQueue(String queueName) {
        String queueKey = getDeadLetterQueueKey(queueName);
        List<String> messageIds = getMessageIds(queueKey);
        redisTemplate.delete(queueKey);
        Set<String> ids = new HashSet<>(messageIds);
        if (!ids.isEmpty()) {
            batchUpdateMqRecordStatus(ids, "delete");
        }
    }

    /**
     * 清空延迟队列
     *
     * @param queueName 队列名称
     */
    public void clearDelayedQueue(String queueName) {
        String queueKey = getDelayedQueueKey(queueName);
        List<String> messageIds = getMessageIds(queueKey);
        redisTemplate.delete(queueKey);
        Set<String> ids = new HashSet<>(messageIds);
        if (!ids.isEmpty()) {
            batchUpdateMqRecordStatus(ids, "delete");
        }
    }

    /**
     * 清空重试计数
     *
     * @param queueName 队列名称
     */
    public void clearRetryCount(String queueName) {
        String queueKey = getRetryCountKey(queueName);
        redisTemplate.delete(queueKey);
    }

    /**
     * 增加重试次数
     *
     * @param queueName 队列名称
     * @param messageId 消息 ID
     */
    public void incrementRetryCount(String queueName, String messageId) {
        String retryCountKey = getRetryCountKey(queueName);
        opsForHash.increment(retryCountKey, messageId, 1);
    }

    public String getWaitingQueueKey(String queueName) {
        return QUEUE_WAITING + queueName;
    }

    public String getProcessingQueueKey(String queueName) {
        return QUEUE_PROCESSING + queueName;
    }

    public String getDeadLetterQueueKey(String queueName) {
        return QUEUE_DEAD_LETTER + queueName;
    }

    public String getDelayedQueueKey(String queueName) {
        return QUEUE_DELAYED + queueName;
    }

    public String getRetryCountKey(String queueName) {
        return QUEUE_RETRY_COUNT + queueName;
    }

    public String getQueueConsumerRunningKey(String queueName) {
        return QUEUE_CONSUMER_RUNNING + queueName;
    }
}
