package com.kongbai9029.customannotation.controller;

import com.kongbai9029.customannotation.anno.PreventDuplicateSubmit;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 防止重复提交功能演示控制器
 *
 * @Author: kongbai9029
 * @Date: 2025/07/31
 */
@RestController
@RequestMapping("duplicate")
public class DuplicateSubmitController {

    @PreventDuplicateSubmit
    @GetMapping("submit")
    public String submit() {
        return "提交成功";
    }
    
    @PreventDuplicateSubmit(value = 5, message = "请勿频繁操作")
    @GetMapping("operation")
    public String operation() {
        return "操作成功";
    }
    
    @PreventDuplicateSubmit(value = 10, timeUnit = java.util.concurrent.TimeUnit.SECONDS, message = "自定义时间窗口10秒")
    @GetMapping("custom")
    public String custom() {
        return "自定义时间窗口操作成功";
    }
}