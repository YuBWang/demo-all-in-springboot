package com.example.queue.handler;

import com.example.queue.model.QueueMessage;

import java.util.Map;

/**
 * <p>标题： Redis队列消息回调</p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2025</p>
 * <p>公司: </p>
 * <p>创建日期：2025/11/12 16:04</p>
 * <p>类全名：cn.snsoft.component.redis.queue.handler.MessageHandler</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
public interface MessageHandler {
    /**
     * 处理消息
     *
     * @param message 消息内容
     * @return 处理是否成功
     */
    boolean handleMessage(String queueName, QueueMessage message, Map<String, Object> envParams);

    /**
     * 处理失败时的回调
     *
     * @param message   消息内容
     * @param exception 异常信息
     */
    void onHandleFailed(String queueName, QueueMessage message, Map<String, Object> envParams, Exception exception);

    /**
     * 未确认执行时移至等待队列
     *
     * @param message   消息
     * @param envParams 环境参数
     * @return boolean
     */
    boolean moveWaitingOnUnAck(String queueName, QueueMessage message, Map<String, Object> envParams);
}
