package com.example.mqusage.listener;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class MessageListener {
    
    @JmsListener(destination = "test.queue")
    public void receiveMessage(Object message) {
        try {
            System.out.println("接收到消息: " + message);
            
            if (message instanceof String) {
                String jsonData = (String) message;
                
                // 解析JSON数据
                ObjectMapper mapper = new ObjectMapper();
                JsonNode jsonNode = mapper.readTree(jsonData);
                
                System.out.println("解析后的数据: id=" + jsonNode.get("id").asText() + 
                                 ", name=" + jsonNode.get("name").asText() +
                                 ", age=" + jsonNode.get("age").asInt());
                System.out.println("------------------------");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}