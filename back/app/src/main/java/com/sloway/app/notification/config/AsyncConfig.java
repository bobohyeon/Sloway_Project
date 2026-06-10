package com.sloway.app.notification.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "notificationTaskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5); // 동시에 처리할 스레드 수
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(5000); // 큐 사이즈
        executor.setThreadNamePrefix("Noti-");
        executor.initialize();
        return executor;
    }
}