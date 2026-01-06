package com.example.service.impl;

import com.example.queue.consumer.QueueConsumer;
import com.example.queue.enums.QueueEnum;
import com.example.queue.handler.DeliveryCreateShipByCCMessageHandler;
import com.example.queue.manager.QueueManager;
import com.example.service.QueueConsumerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class QueueConsumerServiceImpl implements QueueConsumerService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Override
    public void consumer() {
        String queueName = QueueEnum.DELIVERY_CREATE_SHIP_BY_CC.getCode();
        QueueManager queueManager = new QueueManager(redisTemplate);
        QueueConsumer queueConsumer = new QueueConsumer(queueManager);

        // 处理超时消息，如果不存在，则无需调用
        //queueConsumer.processTimeOutMessages(queueName,120000,10);
        queueConsumer.consumerMessageByQueuePrefix(queueName,null, new DeliveryCreateShipByCCMessageHandler());


    }

    @Override
    public void deleteEmptyQueue() {
        QueueManager queueManager = new QueueManager(redisTemplate);
        queueManager.removeInvalidQueueName();

    }
}
