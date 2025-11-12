package com.example.mqusage;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;
import java.util.Enumeration;

public class MqReceiver
{
	public static void main(String[] args)
	{
		String dest = "cust-portal";

        String mqUrl = "tcp://localhost:61616";
        // 设置用户名和密码
        String username = "artemis";
        String password = "artemis";

        ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(username, password, mqUrl);
        Connection connection = null;
        try {
            connection = connectionFactory.createConnection();
            connection.start();
            Session session = connection.createSession(true, Session.AUTO_ACKNOWLEDGE);
            
            Destination destination  = session.createQueue(dest);
            MessageConsumer consumer  = session.createConsumer(destination);
            
            //接收消息
            while(true){
                Message message   = consumer.receive();
                handlerMsg(message);
                //消息确认
                session.commit();
            }
        } catch (JMSException e) {
            e.printStackTrace();
        }finally {
            if(connection !=null){
                try {
                    connection.close();
                } catch (JMSException e) {
                    e.printStackTrace();
                }
            }
        }
    }
	
    //解析消息
    public static void  handlerMsg(Message message){
    	//字节数据处理
        if(message instanceof BytesMessage ){

        }
        //流数据处理
        else if(message instanceof StreamMessage){
            StreamMessage streamMessage = (StreamMessage) message;
            try {
                String str = streamMessage.readString();
                System.out.println("流数据："+ str);
            } catch (JMSException e) {
                e.printStackTrace();
            }
        }
        //文本信息处理
        else if(message instanceof TextMessage){
            TextMessage textMessage = (TextMessage) message;
            try {
                System.out.println("文本信息：" + textMessage.getText());
            } catch (JMSException e) {
                e.printStackTrace();
            }
        }
        //对象处理
        else if(message instanceof ObjectMessage){

        }
        //map数据处理
        else if (message instanceof MapMessage){
            MapMessage mapMessage = (MapMessage) message;
            Enumeration<String> mapNames = null;
            try {
            	mapNames = mapMessage.getMapNames();
                while(mapNames.hasMoreElements()){
                    String key = mapNames.nextElement();
                    //根据情况取类型
                    Object value   = mapMessage.getObject(key);
                    System.out.println(key+ ":"+value);
                }
            } catch (JMSException e) {
                e.printStackTrace();
            }
        }else if(message instanceof Message){
        	System.out.println("其他类型信息");
        }
	}
}
