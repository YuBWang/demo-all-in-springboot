package com.example.mqusage;

import com.example.mqusage.activemq.ActivemqDemoService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class MqUsageApplication {

	public static void main(String[] args) {
		SpringApplication.run(MqUsageApplication.class, args);
	}
}