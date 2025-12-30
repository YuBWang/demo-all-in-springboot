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

            // 设置消息类型为文本类型，并转换为JSON字符串发送
            jmsTemplate.convertAndSend("test.queue", toJsonString(data1));
            System.out.println("发送JSON消息: " + data1);
            
            System.out.println("示例消息发送完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void sendCustomMessage(Object data) {
        Queue queue = new ActiveMQQueue("test.queue");
        jmsTemplate.setDefaultDestination(queue);
        try {
            // 设置消息类型为文本类型，并转换为JSON字符串发送
            if (data instanceof Map) {
                jmsTemplate.convertAndSend("test.queue", toJsonString((Map<String, Object>) data));
            } else {
                jmsTemplate.convertAndSend("test.queue", data.toString());
            }
            System.out.println("发送JSON消息: " + data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private String toJsonString(Map<String, Object> data) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            if (!first) {
                sb.append(",");
            }
            sb.append("\"").append(entry.getKey()).append("\":");
            if (entry.getValue() instanceof String) {
                sb.append("\"").append(entry.getValue()).append("\"");
            } else {
                sb.append(entry.getValue());
            }
            first = false;
        }
        sb.append("}");
        return sb.toString();
    }

    public void sendGroupMessages(String companyid,String ccode) {
        try {
            System.out.println("开始发送分组消息示例消息...");
            String groupid = companyid+"_"+ccode;

            // 发送示例数据
            Map<String, Object> data1 = new HashMap<>();
            data1.put("id", 1);
            data1.put("name", "张三");
            data1.put("age", 25);
            data1.put("email", "zhangsan@example.com");

            // 设置消息类型为文本类型，并转换为JSON字符串发送
            jmsTemplate.convertAndSend("test.group.queue", toJsonString(data1),message -> {
                message.setStringProperty("JMSXGroupID", groupid);
                return message;
            });
            System.out.println("发送JSON消息: " + data1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}