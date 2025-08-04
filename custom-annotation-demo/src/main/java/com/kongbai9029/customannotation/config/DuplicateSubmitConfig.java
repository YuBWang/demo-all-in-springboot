package com.kongbai9029.customannotation.config;

import com.kongbai9029.customannotation.interceptor.DuplicateSubmitInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 防止重复提交配置类
 *
 * @Author: kongbai9029
 * @Date: 2025/07/31
 */
@Configuration
public class DuplicateSubmitConfig implements WebMvcConfigurer {

    @Autowired
    private DuplicateSubmitInterceptor duplicateSubmitInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(duplicateSubmitInterceptor).addPathPatterns("/**");
    }
}