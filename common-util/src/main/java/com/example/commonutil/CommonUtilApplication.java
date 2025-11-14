package com.example.commonutil;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.commonutil.sentinel"})
public class CommonUtilApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommonUtilApplication.class, args);
	}

}