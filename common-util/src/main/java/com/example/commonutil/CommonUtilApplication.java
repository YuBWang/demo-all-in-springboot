package com.example.commonutil;

import com.example.commonutil.limit.ApiRateLimit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.commonutil.*"})
public class CommonUtilApplication {

	public static void main(String[] args) throws InterruptedException {
		ConfigurableApplicationContext ctx = SpringApplication.run(CommonUtilApplication.class, args);

		// 限流器初始化
		ctx.getBean(ApiRateLimit.class).init();
	}

}