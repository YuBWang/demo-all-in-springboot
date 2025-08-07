package com.example.commonutil;

import java.lang.reflect.Field;
import java.util.*;

/**
 * 对象字段比较工具类
 * 用于比较同一个对象的新旧版本之间哪些字段发生了变化
 */
public class ObjectFieldComparator {

    /**
     * 比较两个对象的字段差异
     * @param oldObject 旧版本对象
     * @param newObject 新版本对象
     * @return 包含变化字段信息的Map，key为字段名，value为长度为2的数组，分别包含旧值和新值
     */
    public static Map<String, Object[]> compareFields(Object oldObject, Object newObject) {
        Map<String, Object[]> changedFields = new HashMap<>();
        
        // 如果任一对象为null，返回空Map
        if (oldObject == null || newObject == null) {
            return changedFields;
        }
        
        // 如果两个对象不是同一类型，返回空Map
        if (!oldObject.getClass().equals(newObject.getClass())) {
            return changedFields;
        }
        
        // 获取对象的所有字段（包括父类字段）
        Class<?> clazz = oldObject.getClass();
        List<Field> fields = getAllFields(clazz);
        
        // 遍历所有字段进行比较
        for (Field field : fields) {
            try {
                // 设置字段可访问
                field.setAccessible(true);
                
                // 获取字段在两个对象中的值
                Object oldValue = field.get(oldObject);
                Object newValue = field.get(newObject);
                
                // 比较字段值是否发生变化
                if (!Objects.equals(oldValue, newValue)) {
                    changedFields.put(field.getName(), new Object[]{oldValue, newValue});
                }
            } catch (IllegalAccessException e) {
                // 忽略无法访问的字段
            }
        }
        
        return changedFields;
    }
    
    /**
     * 获取类的所有字段，包括父类中的字段
     * @param clazz 类对象
     * @return 所有字段的列表
     */
    private static List<Field> getAllFields(Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        
        // 遍历类及其所有父类
        while (clazz != null && !clazz.equals(Object.class)) {
            Field[] declaredFields = clazz.getDeclaredFields();
            fields.addAll(Arrays.asList(declaredFields));
            clazz = clazz.getSuperclass();
        }
        
        return fields;
    }
    
    /**
     * 格式化输出字段变化信息
     * @param changedFields 字段变化信息
     * @return 格式化后的字符串
     */
    public static String formatChangedFields(Map<String, Object[]> changedFields) {
        if (changedFields.isEmpty()) {
            return "没有字段发生变化";
        }
        
        StringBuilder result = new StringBuilder();
        result.append("以下字段发生了变化:\n");
        
        for (Map.Entry<String, Object[]> entry : changedFields.entrySet()) {
            String fieldName = entry.getKey();
            Object[] values = entry.getValue();
            result.append(String.format("- %s: %s -> %s\n", 
                    fieldName, 
                    values[0] == null ? "null" : values[0].toString(),
                    values[1] == null ? "null" : values[1].toString()));
        }
        
        return result.toString();
    }

    public static<T> void test (T e){
        Field[] field = e.getClass().getDeclaredFields();
        for (Field f : field) {
            f.setAccessible(true);
            try {
                System.out.println(f.getName() + ":" + f.get(e));
            } catch (IllegalAccessException ex) {
                ex.printStackTrace();
            }
        }
    }

    private<T> void test1 (T e){
        Field[] field = e.getClass().getDeclaredFields();
        for (Field f : field) {
            f.setAccessible(true);
            try {
                System.out.println(f.getName() + ":" + f.get(e));
            } catch (IllegalAccessException ex) {
                ex.printStackTrace();
            }
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
        test(company);
    }
}