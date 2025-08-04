package com.kongbai9029.customannotation.interceptor;

import com.kongbai9029.customannotation.anno.PreventDuplicateSubmit;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * 防止重复提交拦截器
 *
 * @Author: kongbai9029
 * @Date: 2025/07/31
 */
@Component
public class DuplicateSubmitInterceptor implements HandlerInterceptor {

    // 使用ConcurrentHashMap作为本地缓存存储已提交的请求标识
    private final ConcurrentHashMap<String, Long> cache = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        PreventDuplicateSubmit duplicateSubmit = handlerMethod.getMethod().getAnnotation(PreventDuplicateSubmit.class);
        if (duplicateSubmit == null) {
            return true;
        }

        // 构建请求标识
        String requestKey = buildRequestKey(request);
        
        // 获取过期时间
        long expireTime = duplicateSubmit.timeUnit().toMillis(duplicateSubmit.value());
        
        // 尝试将请求标识放入缓存，如果已存在则返回false
        Long currentTime = System.currentTimeMillis();
        Long previousTime = cache.putIfAbsent(requestKey, currentTime);
        
        if (previousTime != null) {
            // 检查是否已过期
            if (currentTime - previousTime < expireTime) {
                // 未过期，返回重复提交错误
                response.setContentType("application/json; charset=utf-8");
                response.getWriter().print(duplicateSubmit.message());
                return false;
            } else {
                // 已过期，更新时间
                cache.put(requestKey, currentTime);
            }
        }
        
        // 启动一个线程在过期时间后清理缓存
        Thread cleanerThread = new Thread(() -> {
            try {
                Thread.sleep(expireTime);
                cache.remove(requestKey);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        cleanerThread.setDaemon(true);
        cleanerThread.start();
        
        return true;
    }

    /**
     * 构建请求标识，根据用户ID、请求URI和参数生成
     * @param request 请求对象
     * @return 请求标识
     */
    private String buildRequestKey(HttpServletRequest request) {
        // 简单实现：使用请求URI+用户IP作为唯一标识
        String uri = request.getRequestURI();
        String clientIP = getClientIP(request);
        String params = request.getQueryString() != null ? request.getQueryString() : "";
        
        return uri + ":" + clientIP + "?" + params;
    }

    /**
     * 获取客户端真实IP地址
     * @param request 请求对象
     * @return 客户端IP地址
     */
    private String getClientIP(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}