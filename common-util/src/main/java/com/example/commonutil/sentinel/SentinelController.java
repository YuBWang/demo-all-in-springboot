package com.example.commonutil.sentinel;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SentinelController {

    @GetMapping("/test")
    @SentinelResource(value = "testResource", blockHandler = "handleBlock")
    public String test() {
        System.out.println("正确访问进来了");
        return "正确访问进来了";
    }

    public String handleBlock(BlockException ex) {
        // 记录限流信息，可根据需要日志记录
        // ex.getClass().getSimpleName() 可以看出是流控还是降级等异常
        System.out.println("请求被拦截");
        return "请求过于频繁，请稍后再试。";
    }
}
