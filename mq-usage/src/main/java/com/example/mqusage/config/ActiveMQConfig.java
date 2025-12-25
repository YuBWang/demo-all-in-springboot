package com.example.mqusage.config;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.RedeliveryPolicy;
import org.springframework.jms.connection.CachingConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;
import org.springframework.jms.core.JmsTemplate;

import javax.jms.Session;

@Configuration
@EnableJms
public class ActiveMQConfig {

    @Value("${spring.activemq.broker-url}")
    private String brokerUrl;

    @Value("${spring.activemq.user}")
    private String username;

    @Value("${spring.activemq.password}")
    private String password;

    @Bean
    public ActiveMQConnectionFactory connectionFactory() {
        ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory();
        connectionFactory.setBrokerURL(brokerUrl);
        connectionFactory.setUserName(username);
        connectionFactory.setPassword(password);
        connectionFactory.setRedeliveryPolicy(redeliveryPolicy()); // 设置重投递策略
        return connectionFactory;
    }

    @Bean
    public CachingConnectionFactory cachConnectionFactory() {
        CachingConnectionFactory cachingConnectionFactory = new CachingConnectionFactory(connectionFactory());

        // 配置连接池参数
        cachingConnectionFactory.setSessionCacheSize(50);  // 会话缓存数量
        cachingConnectionFactory.setCacheProducers(true);  // 缓存消息生产者
        cachingConnectionFactory.setCacheConsumers(true);  // 缓存消息消费者
        cachingConnectionFactory.setReconnectOnException(true); // 异常时重连

        return cachingConnectionFactory;
    }

    @Bean
    public JmsTemplate jmsTemplate() {
        JmsTemplate template = new JmsTemplate();
        template.setConnectionFactory(cachConnectionFactory());
        // 设置默认目的地
        template.setDefaultDestinationName("test.queue");
        return template;
    }

    @Bean
    public DefaultJmsListenerContainerFactory jmsListenerContainerFactory() {
        DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
        factory.setConnectionFactory(cachConnectionFactory()); // 使用缓存连接工厂
        factory.setConcurrency("1-1");
        // 设置为手动确认模式
        factory.setSessionAcknowledgeMode(Session.CLIENT_ACKNOWLEDGE);
        // 关键设置：关闭自动确认
        factory.setAutoStartup(true);
        // 重要：设置为false，让Spring不介入确认过程
        factory.setSessionTransacted(false);
        // 设置当消费者抛出异常时，重新投递消息
        factory.setErrorHandler(t -> {
            System.out.println("监听器发生错误: " + t.getMessage());
        });

        // 设置异常处理策略，确保在异常时不自动确认消息
        factory.setSessionTransacted(false);
        return factory;
    }

    @Bean
    public RedeliveryPolicy redeliveryPolicy() {
        RedeliveryPolicy redeliveryPolicy = new RedeliveryPolicy();
        redeliveryPolicy.setMaximumRedeliveries(3); // 最大重试次数
        redeliveryPolicy.setInitialRedeliveryDelay(1000); // 初始重试延迟1秒
        redeliveryPolicy.setRedeliveryDelay(5000); // 后续重试延迟5秒
        redeliveryPolicy.setUseExponentialBackOff(false); // 不使用指数退避
        return redeliveryPolicy;
    }


}