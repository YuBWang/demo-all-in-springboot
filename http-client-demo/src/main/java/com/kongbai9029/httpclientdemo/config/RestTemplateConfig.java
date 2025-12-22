package com.kongbai9029.httpclientdemo.config;

import com.kongbai9029.httpclientdemo.intercept.restIntercept;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: wyb
 * @Date: 2022/1/12 17:05
 */
@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate(){
        RestTemplate restTemplate = new RestTemplate();
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(new restIntercept());
        restTemplate.setInterceptors(interceptors);
        return restTemplate;

    }
}
