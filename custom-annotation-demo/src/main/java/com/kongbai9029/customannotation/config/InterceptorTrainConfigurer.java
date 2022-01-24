package com.kongbai9029.customannotation.config;

import com.kongbai9029.customannotation.aspect.LoginAspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @Author: wyb
 * @Date: 2022/1/24 18:07
 */
@Configuration
public class InterceptorTrainConfigurer implements WebMvcConfigurer {

    @Autowired
    private LoginAspect loginAspect;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginAspect).addPathPatterns("/**");
    }
}
