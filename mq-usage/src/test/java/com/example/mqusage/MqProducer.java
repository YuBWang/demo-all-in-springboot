package com.example.mqusage;

import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;

public class MqProducer
{
    // 参考资料 https://www.cnblogs.com/progor/p/10877677.html
	public static void main(String[] args)
	{
		String dest = "cust-portal";

		String mqUrl = "tcp://localhost:61616";
		// 设置用户名和密码
		String username = "artemis";
		String password = "artemis";
		
		ConnectionFactory connectionFactory = new ActiveMQConnectionFactory(username, password, mqUrl);
		//此链接为jms链接，非数据库连接
		Connection connection = null;
        try {
            connection = connectionFactory.createConnection();
            connection.start();
            Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            Destination destination  = session.createQueue(dest);
            MessageProducer producer  = session.createProducer(destination);
            //发送信息,模拟发送10条数据，此处提供三种不同方式数据传输
            for(int i = 0; i < 10; i++){
            	//单文本消息
               TextMessage msg = session.createTextMessage("第:" + i + "条数据" );
                
                //map信息（我们项目大部分应该是用这个，或者用json包装文本消息）
                MapMessage mapMessage = session.createMapMessage();
                mapMessage.setString("主键","innercode");
                mapMessage.setString("数据库表","table");
                
                //流信息
                StreamMessage streamMessage  = session.createStreamMessage();
                streamMessage.writeString("流消息");
                
                
       //         producer.send(msg);
                producer.send(mapMessage);
//                producer.send(streamMessage);
            }
        } catch (JMSException e) {
            e.printStackTrace();
        }finally {
            if( connection !=null){
                try {
                    connection.close();
                } catch (JMSException e) {
                    e.printStackTrace();
                }
            }
        }
	}
}