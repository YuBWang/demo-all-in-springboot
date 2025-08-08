package com.example.commonutil;

import java.lang.reflect.Method;

/**
 * 反射工具类
 * 提供通过反射调用其他类方法的功能
 */
public class ReflectionUtil {

    /**
     * 通过反射调用ObjectFieldComparator类中的test1方法
     * @param obj 要传入的对象
     */
    public static void invokeTest1(Object obj) {
        try {
            // 获取ObjectFieldComparator类
            Class<?> clazz = ObjectFieldComparator.class;
            
            // 获取test1方法（私有方法）
            Method method = clazz.getDeclaredMethod("test1", Object.class);
            
            // 设置方法可访问（因为test1是私有方法）
            method.setAccessible(true);
            
            // 调用方法
            method.invoke(null, obj);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Method[] getAllMethods(Class<?> clazz) {
        Method[] methods = clazz.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println(method.getName());
        }
        return methods;
    }

    public static void invokePrivateMethod(Object obj, String methodName, Object... args) {
        try {
            Class<?> clazz = obj.getClass();
            Method method = clazz.getDeclaredMethod(methodName, String.class);
            method.setAccessible(true);
            method.invoke(obj, args);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        Company company = new Company();
        company.setName("company");
        company.setAddress("address");
        company.setCity("city");
        company.setState("state");
        company.setZip("zip");
        company.setPhone("phone");
        company.setFax("fax");
        company.setEmail("email");

        invokePrivateMethod(company,"print","hello");
        //invokeTest1(company);
    }

}