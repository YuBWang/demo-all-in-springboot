package com.example.queue.util;

import java.util.Map;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class ApplicationContextUtil implements ApplicationContextAware {
    private static volatile ApplicationContext	context;

    public static ApplicationContext getContext()
    {
        checkApplicationContext();
        return context;
    }

    public static <T> T getBean(String beanId)
    {
        checkApplicationContext();
        T bean = (T) context.getBean(beanId);
        if (bean == null)
        {
            throw new java.lang.RuntimeException("未找到 BEAN：ID=" + beanId + ", 请检查 applicationContext-xxx.xml 定义！");
        }
        return bean;
    }

    public static <T> Map<String,T> getBean(Class<T> clazz)
    {
        checkApplicationContext();
        Map<String,T> beanMap = context.getBeansOfType(clazz);
        if (beanMap == null)
        {
            throw new java.lang.RuntimeException("未找到 BEAN：Class=" + clazz.getName() + ", 请检查 applicationContext-xxx.xml 定义！");
        }
        return beanMap;
    }

    public static <T> T getBean(String beanId, Class<T> clazz)
    {
        checkApplicationContext();
        T bean = context.getBean(beanId, clazz);
        if (bean == null)
        {
            throw new java.lang.RuntimeException("未找到 BEAN：ID=" + beanId + ", & Class=" + clazz.getName() + "  请检查 applicationContext-xxx.xml 定义！");
        }
        return bean;
    }

    public static void setContext(ApplicationContext ctx)
    {
        context = ctx;
    }

    private static synchronized void checkApplicationContext()
    {
        if (context == null)
        {
            throw new IllegalStateException("applicaitonContext未注入!");
        }
    }

    @Override
    public void setApplicationContext(ApplicationContext ctx)
    {
        ApplicationContextUtil.context = ctx;
    }
}