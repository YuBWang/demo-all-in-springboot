package com.example.mqusage;

import com.example.mqusage.activemq.ActivemqDemoService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.mqusage"}) // 明确指定扫描包
public class MqUsageApplication {

	public static void main(String[] args) {
		SpringApplication.run(MqUsageApplication.class, args);
	}
}