package com.example.queue.consumer;

import com.example.queue.handler.MessageHandler;
import com.example.queue.manager.QueueManager;
import com.example.queue.model.QueueMessage;
import com.example.queue.model.QueueStats;
import com.example.queue.util.MapUtil;
import com.example.queue.util.QueueUtil;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import java.util.concurrent.ArrayBlockingQueue;


import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * <p>标题： Redis队列消费（遵循先进先出原则）</p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2025</p>
 * <p>公司: </p>
 * <p>创建日期：2025/11/12 16:06</p>
 * <p>类全名：cn.snsoft.component.redis.queue.consumer.QueueConsumer</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */

public class QueueConsumer {

    private final QueueManager queueManager;

    /**
     * 工作队列
     */
    private final ArrayBlockingQueue<Runnable> workQueue = new ArrayBlockingQueue<>(100);


    public QueueConsumer(QueueManager queueManager) {
        this.queueManager = queueManager;
    }

    /**
     * 按队列前缀消费
     *
     * @param queuePrefix 队列前缀
     * @param envParams   环境参数
     * @param handler     处理器
     */
    public void consumerMessageByQueuePrefix(final String queuePrefix, final Map<String, Object> envParams, final MessageHandler handler) {
        if (!StringUtils.hasText(queuePrefix)) {
            return;
        }
        Set<String> queueNames = queueManager.getQueueNamesByPrefix(queuePrefix);
        if (!CollectionUtils.isEmpty(queueNames)) {
            for (final String queueName : queueNames) {
                consumerMessage(queueName, envParams, handler);
            }

        }
    }

    /**
     * 单条消息消费
     */
    public void consumerMessage(final String queueName, final Map<String, Object> envParams, final MessageHandler handler) {
        //先校验池子中是否有需消费的信息，避免空池子一直阻塞
        QueueStats stats = queueManager.getQueueStats(queueName);
        long waitingCount = stats.getWaitingCount();
        long delayedCount = stats.getDelayedCount();
        if (waitingCount == 0 && delayedCount == 0) {
            return;
        }
        //获取队列消费分布式锁,保证顺序执行，同个时间同个队列只有一处程序在消费
        final String queueConsumerRunningKey = queueManager.getQueueConsumerRunningKey(queueName);
        //默认60秒过期
        boolean canConsumer = QueueUtil.setQueueConsumerRunningKey(queueConsumerRunningKey, 60, TimeUnit.SECONDS);
        if (canConsumer) {
            boolean error = false;
            try {
                // 阻塞获取消息，超时时间5秒
                QueueMessage message = queueManager.receiveMessage(queueName, 5, TimeUnit.SECONDS);

                if (message != null) {
                    processMessage(queueName, message, handler, envParams);
                }
            } catch (Exception e) {

            } finally {
                //消费完，主动解锁
                QueueUtil.deleteQueueConsumerRunningKey(queueConsumerRunningKey);

            }
        }

    }

    /**
     * 处理单条消息
     */
    public void processMessage(String queueName, QueueMessage message, MessageHandler handler, Map<String, Object> envParams) {
        boolean success = false;
        String messageJson = queueManager.writeValueAsString(message);
        String messageId = message.getId();
        Class<?> handlerClass = handler.getClass();
        String handlerClassName = handlerClass.getName();
        boolean errorFlag = false;
        String poolName = Thread.currentThread().getName();
        try {
            success = handler.handleMessage(queueName, message, envParams);
        } catch (Exception e) {
            handler.onHandleFailed(queueName, message, envParams, e);
            //处理异常，移动到死信队列
            queueManager.moveToDeadLetter(queueName, messageJson, messageId, handlerClassName, poolName, e.getMessage());
            errorFlag = true;
        } finally {
            if (!errorFlag) {
                if (success) {
                    // 处理成功，确认消息
                    queueManager.acknowledge(queueName, message);
                    //状态更新为成功
                    queueManager.updateMqRecord(messageId, QueueManager.QUEUE_STATUS_SUCCESS, MapUtil.toHashMap("handlername", handlerClassName,
                            "excutetime", new Date(), "poolname", poolName));
                } else {
                    boolean moveWaitingOnUnAck = handler.moveWaitingOnUnAck(queueName, message, envParams);
                    if (moveWaitingOnUnAck) {
                        message.setStartProcessTime(null);
                        Object updateMessageJson = queueManager.writeValueAsString(message);
                        queueManager.moveToWaiting(queueName, messageJson, updateMessageJson, messageId, handlerClassName);
                    } else {
                        // 处理失败，消息会在超时检查时重新入队
                        queueManager.updateMqRecord(messageId, QueueManager.QUEUE_STATUS_PROCESSING, MapUtil.toHashMap("handlername", handlerClassName,
                                "excutetime", null, "poolname", null));
                    }
                }
            }
        }
    }

    /**
     * 超时消息处理任务（建议使用定时任务调用，以达到定时清理）
     */
    public void processTimeOutMessages(String queuePrefix, long timeOutMills, int maxRetries) {

        Set<String> queueNames = queueManager.getQueueNamesByPrefix(queuePrefix);
        if (!CollectionUtils.isEmpty(queueNames)) {
            for (final String queueName : queueNames) {
                //同步执行
                queueManager.processTimeOutMessages(queueName, timeOutMills, maxRetries);
            }
        }
    }
}
