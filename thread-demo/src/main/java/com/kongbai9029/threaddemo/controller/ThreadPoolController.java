package com.kongbai9029.threaddemo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.Executor;

@RestController
@RequestMapping("threadpool")
public class ThreadPoolController {

    @Autowired
    private Executor commonThreadPool;

    @GetMapping("/test")
    public String threadPool() {
        commonThreadPool.execute(() -> {
            System.out.println("线程池执行任务：" + Thread.currentThread().getName());
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        commonThreadPool.execute(() -> {
            System.out.println("线程池执行任务：" + Thread.currentThread().getName());
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });
        return "Tasks submitted to thread pool successfully";
    }
}