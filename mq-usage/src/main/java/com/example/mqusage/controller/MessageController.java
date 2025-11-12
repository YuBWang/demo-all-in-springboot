package com.example.mqusage.controller;

import com.example.mqusage.activemq.ActivemqDemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class MessageController {
    
    @Autowired
    private ActivemqDemoService activemqDemoService;
    
    @GetMapping("/sendSample")
    public String sendSampleMessages() {
        try {
            activemqDemoService.sendSampleMessages();
            return "示例消息已发送";
        } catch (Exception e) {
            e.printStackTrace();
            return "发送失败: " + e.getMessage();
        }
    }
    
    @GetMapping("/sendCustom")
    public String sendCustomMessage() {
        try {
            Map<String, Object> customData = new HashMap<>();
            customData.put("id", 3);
            customData.put("name", "王五");
            customData.put("age", 28);
            customData.put("department", "技术部");
            customData.put("salary", 15000);
            
            activemqDemoService.sendCustomMessage(customData);
            return "自定义消息已发送";
        } catch (Exception e) {
            e.printStackTrace();
            return "发送失败: " + e.getMessage();
        }
    }
}