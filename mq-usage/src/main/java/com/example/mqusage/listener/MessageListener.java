package com.example.mqusage.listener;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import javax.jms.Message;
import javax.jms.TextMessage;
import javax.jms.JMSException;
import java.util.Enumeration;
import java.util.Map;

@Component
public class MessageListener {
    // 使用 @JmsListener 默认是自动消息确认的，想要手动确认，需要额外处理

    @JmsListener(destination = "test.queue", containerFactory = "jmsListenerContainerFactory")
    public void receiveMessage(Message message) {
        try {
            System.out.println("接收到消息类型: " + message.getClass().getName());
            System.out.println("接收到消息: " + message);
            
            // 打印消息属性
            Enumeration propertyNames = message.getPropertyNames();
            System.out.println("消息属性:");
            while (propertyNames.hasMoreElements()) {
                String propertyName = (String) propertyNames.nextElement();
                System.out.println("  " + propertyName + ": " + message.getObjectProperty(propertyName));
            }
            
            // 处理 TextMessage 类型
            if (message instanceof TextMessage) {
                String jsonData = ((TextMessage) message).getText();
                System.out.println("消息内容为文本: " + jsonData);
                
                // 解析JSON数据（使用更简单的方法避免Jackson版本问题）
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode jsonNode = mapper.readTree(jsonData);
                    
                    System.out.println("解析后的数据: id=" + jsonNode.get("id").asText() + 
                                     ", name=" + jsonNode.get("name").asText() +
                                     ", age=" + jsonNode.get("age").asInt());
                    System.out.println("------------------------");
                } catch (Exception e) {
                    // 如果Jackson解析失败，使用基本的字符串处理
                    System.out.println("使用Jackson解析JSON失败: " + e.getMessage());
                    parseJsonManually(jsonData);
                }
                
                // 手动确认消息
                // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                System.out.println("TextMessage类型消息已处理但未确认");
            } 
            // 处理 MapMessage 或 ObjectMessage 类型（Spring发送的Map对象）
            else if (message instanceof javax.jms.MapMessage) {
                javax.jms.MapMessage mapMessage = (javax.jms.MapMessage) message;
                System.out.println("消息内容为Map:");
                
                // 遍历Map中的键值对
                Enumeration mapNames = mapMessage.getMapNames();
                while (mapNames.hasMoreElements()) {
                    String key = (String) mapNames.nextElement();
                    Object value = mapMessage.getObject(key);
                    System.out.println("  " + key + ": " + value);
                }
                
                System.out.println("------------------------");
                
                // 手动确认消息
                // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                System.out.println("MapMessage类型消息已处理但未确认");
            }
            // 处理 Spring 发送的对象消息（可能被序列化为 ObjectMessage）
            else if (message instanceof javax.jms.ObjectMessage) {
                javax.jms.ObjectMessage objMessage = (javax.jms.ObjectMessage) message;
                Object object = objMessage.getObject();
                System.out.println("消息内容为对象: " + object);
                System.out.println("对象类型: " + object.getClass().getName());
                
                // 如果是Map类型，进一步处理
                if (object instanceof Map) {
                    Map map = (Map) object;
                    System.out.println("对象内容为Map:");
                    for (Object key : map.keySet()) {
                        System.out.println("  " + key + ": " + map.get(key));
                    }
                }
                
                System.out.println("------------------------");
                
                // 手动确认消息
                // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                System.out.println("ObjectMessage类型消息已处理但未确认");
            }
            // 处理其他可能的消息类型
            else {
                // 对于Spring发送的Map类型消息，我们可以尝试获取其中的字段
                try {
                    String id = message.getStringProperty("id");
                    String name = message.getStringProperty("name");
                    String age = message.getStringProperty("age");
                    
                    if (id != null && name != null) {
                        System.out.println("从消息属性中提取的数据: id=" + id + 
                                         ", name=" + name + 
                                         ", age=" + age);
                        
                        // 手动确认消息
                        // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                        System.out.println("从属性中提取的消息已处理但未确认");
                    } else {
                        System.out.println("未知消息格式，无法处理");
                        // message.acknowledge(); // 即使不能处理，也要确认避免消息堆积
                        // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                        System.out.println("未知格式消息已处理但未确认");
                    }
                } catch (Exception e) {
                    System.out.println("处理非文本消息时出错: " + e.getMessage());
                    // message.acknowledge(); // 出错时也确认消息
                    // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                    System.out.println("异常情况消息已处理但未确认");
                }
            }
            //【关键】必须再次抛出异常，打破 Spring 的“默认成功”幻想，如果没有异常，Spring JMS捕获不到异常，认为“消费成功”，于是自动执行了 acknowledge()
            //throw new RuntimeException("测试异常 - 消息应该重新入队");
            // 在这 1500 秒内，你去 ActiveMQ 控制台看，消息会处于 Unacknowledged (In Flight) 状态，也就是还在队列里（但被锁定了）。一旦 100 秒结束，方法返回，消息就会立马消失
            Thread.sleep(1500);
        } catch (Exception e) {
            e.printStackTrace();
            // 出现异常时根据需要决定是否确认消息
            // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
            System.out.println("异常TextMessage类型消息已处理但未确认");
            // 遇到错误抛出异常时，超过配置的重试次数后，消息会进入死信队列
            //throw new RuntimeException("消息处理失败", e);
        }
    }
    
    /**
     * 手动解析简单的JSON字符串（避免依赖Jackson的复杂功能）
     * @param jsonData JSON字符串
     */
    private void parseJsonManually(String jsonData) {
        try {
            System.out.println("尝试手动解析JSON:");
            // 移除大括号
            String content = jsonData.replaceAll("[{}]", "");
            // 按逗号分割
            String[] pairs = content.split(",");
            
            for (String pair : pairs) {
                String[] keyValue = pair.split(":", 2);
                if (keyValue.length == 2) {
                    // 移除引号
                    String key = keyValue[0].replaceAll("\"", "").trim();
                    String value = keyValue[1].replaceAll("\"", "").trim();
                    System.out.println("  " + key + ": " + value);
                }
            }
        } catch (Exception e) {
            System.out.println("手动解析JSON也失败了: " + e.getMessage());
        }
    }

    @JmsListener(destination = "test.group.queue", containerFactory = "jmsListenerContainerFactory",concurrency = "5-10")
    public void groupMessageComsumer(Message message) throws InterruptedException, JMSException {
        System.out.println("线程 [" + Thread.currentThread().getName() + "] 开始处理数据: " + message.getJMSPriority());

        // 模拟业务逻辑处理
        Thread.sleep(5000);
        try {
            System.out.println("接收到消息类型: " + message.getClass().getName());
            System.out.println("接收到消息: " + message);

            // 打印消息属性
            Enumeration propertyNames = message.getPropertyNames();
            System.out.println("消息属性:");
            while (propertyNames.hasMoreElements()) {
                String propertyName = (String) propertyNames.nextElement();
                System.out.println("  " + propertyName + ": " + message.getObjectProperty(propertyName));
            }

            // 处理 TextMessage 类型
            if (message instanceof TextMessage) {
                String jsonData = ((TextMessage) message).getText();
                System.out.println("消息内容为文本: " + jsonData);

                // 解析JSON数据（使用更简单的方法避免Jackson版本问题）
                ObjectMapper mapper = new ObjectMapper();
                JsonNode jsonNode = mapper.readTree(jsonData);

                System.out.println("解析后的数据: id=" + jsonNode.get("id").asText() +
                        ", name=" + jsonNode.get("name").asText() +
                        ", age=" + jsonNode.get("age").asInt());
                System.out.println("------------------------");

                // 手动确认消息
                // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                System.out.println("TextMessage类型消息已处理但未确认");
            }
            // 处理 MapMessage 或 ObjectMessage 类型（Spring发送的Map对象）
            else if (message instanceof javax.jms.MapMessage) {
                javax.jms.MapMessage mapMessage = (javax.jms.MapMessage) message;
                System.out.println("消息内容为Map:");

                // 遍历Map中的键值对
                Enumeration mapNames = mapMessage.getMapNames();
                while (mapNames.hasMoreElements()) {
                    String key = (String) mapNames.nextElement();
                    Object value = mapMessage.getObject(key);
                    System.out.println("  " + key + ": " + value);
                }

                System.out.println("------------------------");

                // 手动确认消息
                // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                System.out.println("MapMessage类型消息已处理但未确认");
            }
            // 处理 Spring 发送的对象消息（可能被序列化为 ObjectMessage）
            else if (message instanceof javax.jms.ObjectMessage) {
                javax.jms.ObjectMessage objMessage = (javax.jms.ObjectMessage) message;
                Object object = objMessage.getObject();
                System.out.println("消息内容为对象: " + object);
                System.out.println("对象类型: " + object.getClass().getName());

                // 如果是Map类型，进一步处理
                if (object instanceof Map) {
                    Map map = (Map) object;
                    System.out.println("对象内容为Map:");
                    for (Object key : map.keySet()) {
                        System.out.println("  " + key + ": " + map.get(key));
                    }
                }

                System.out.println("------------------------");

                // 手动确认消息
                // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                System.out.println("ObjectMessage类型消息已处理但未确认");
            }
            // 处理其他可能的消息类型
            else {
                // 对于Spring发送的Map类型消息，我们可以尝试获取其中的字段

                String id = message.getStringProperty("id");
                String name = message.getStringProperty("name");
                String age = message.getStringProperty("age");

                if (id != null && name != null) {
                    System.out.println("从消息属性中提取的数据: id=" + id +
                            ", name=" + name +
                            ", age=" + age);

                    // 手动确认消息
                    message.acknowledge();  // 注释掉以测试消息是否保留在队列中
                    System.out.println("从属性中提取的消息已处理但未确认");
                } else {
                    System.out.println("未知消息格式，无法处理");

                }
            }
            //【关键】必须再次抛出异常，打破 Spring 的“默认成功”幻想，如果没有异常，Spring JMS捕获不到异常，认为“消费成功”，于是自动执行了 acknowledge()
            //throw new RuntimeException("测试异常 - 消息应该重新入队");
            // 在这 1500 秒内，你去 ActiveMQ 控制台看，消息会处于 Unacknowledged (In Flight) 状态，也就是还在队列里（但被锁定了）。一旦 100 秒结束，方法返回，消息就会立马消失
            Thread.sleep(150);
        } catch (Exception e) {
            e.printStackTrace();
            // 出现异常时根据需要决定是否确认消息
            // message.acknowledge();  // 注释掉以测试消息是否保留在队列中
            System.out.println("异常TextMessage类型消息已处理但未确认");
            // 遇到错误抛出异常时，超过配置的重试次数后，消息会进入死信队列
            //throw new RuntimeException("消息处理失败", e);
        }
    }
}