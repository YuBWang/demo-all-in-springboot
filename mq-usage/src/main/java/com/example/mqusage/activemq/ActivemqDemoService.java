package com.example.mqusage.activemq;

import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import javax.jms.Queue;
import java.util.HashMap;
import java.util.Map;

@Service
public class ActivemqDemoService {
    
    @Autowired
    private JmsTemplate jmsTemplate;
    
    public void sendSampleMessages() {
       //Queue queue = new ActiveMQQueue("test.queue");
        //jmsTemplate.setDefaultDestination(queue);
        try {
            System.out.println("开始发送示例消息...");
            
            // 发送示例数据
            Map<String, Object> data1 = new HashMap<>();
            data1.put("id", 1);
            data1.put("name", "张三");
            data1.put("age", 25);
            data1.put("email", "zhangsan@example.com");
            
            Map<String, Object> data2 = new HashMap<>();
            data2.put("id", 2);
            data2.put("name", "李四");
            data2.put("age", 30);
            data2.put("email", "lisi@example.com");
            
            jmsTemplate.convertAndSend("test.queue", data1);
            System.out.println("发送JSON消息: " + data1);
            
            jmsTemplate.convertAndSend("test.queue", data2);
            System.out.println("发送JSON消息: " + data2);
            
            System.out.println("示例消息发送完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void sendCustomMessage(Object data) {
        Queue queue = new ActiveMQQueue("test.queue");
        jmsTemplate.setDefaultDestination(queue);
        try {
            jmsTemplate.convertAndSend("test.queue", data);
            System.out.println("发送JSON消息: " + data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}