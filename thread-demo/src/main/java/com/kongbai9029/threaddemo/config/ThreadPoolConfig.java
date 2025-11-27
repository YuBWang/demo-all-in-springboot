package com.kongbai9029.threaddemo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class ThreadPoolConfig {

    @Value("${spring.task.execution.pool.core-size}")
    private int corePoolSize;

    @Value("${spring.task.execution.pool.max-size}")
    private int maxPoolSize;

    @Value("${spring.task.execution.pool.queue-capacity}")
    private int queueCapacity;

    @Value("${spring.task.execution.pool.keep-alive}")
    private int keepAliveSeconds;

    @Value("${spring.task.execution.thread-name-prefix}")
    private String threadNamePrefix;

    @Bean("commonThreadPool")
    public Executor commonThreadPool() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // 1. 核心线程数：线程池创建时候初始化的线程数
        executor.setCorePoolSize(corePoolSize);

        // 2. 最大线程数：线程池最大的线程数，只有在缓冲队列满了之后才会申请超过核心线程数的线程
        executor.setMaxPoolSize(maxPoolSize);

        // 3. 缓冲队列：用来缓冲执行任务的队列
        executor.setQueueCapacity(queueCapacity);

        // 4. 允许线程的空闲时间：当超过了核心线程出之外的线程在空闲时间到达之后会被销毁
        executor.setKeepAliveSeconds(keepAliveSeconds);

        // 5. 线程名前缀：方便排查日志
        executor.setThreadNamePrefix(threadNamePrefix);

        // 6. 拒绝策略：当线程池和队列都满了，新任务的处理方式
        // CallerRunsPolicy: 由调用者所在的线程来执行该任务 (推荐，能防止任务丢失，但会降低吞吐量)
        // AbortPolicy: 抛出异常 (默认)
        // DiscardPolicy: 直接丢弃
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        // 7. 优雅关闭：应用关闭时，是否等待任务执行结束
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(60); // 等待时间

        executor.initialize();
        return executor;
    }
}
