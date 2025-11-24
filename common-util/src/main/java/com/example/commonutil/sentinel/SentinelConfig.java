package com.example.commonutil.sentinel;

import com.alibaba.csp.sentinel.slots.block.RuleConstant;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRule;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRuleManager;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class SentinelConfig {

    /**
     * 执行顺序：@PostConstruct在Bean初始化阶段（依赖注入之后）执行，而启动类中的CommandLineRunner或ApplicationRunner在应用启动完成后执行。因此，@PostConstruct方法先于启动类中的Runner方法执行。
     *
     * 使用范围：@PostConstruct用于Bean的初始化，每个Bean都可以有自己的@PostConstruct方法。而启动类中的初始化通常是全局的，一般用于应用级别的初始化。
     *
     * 控制粒度：@PostConstruct更细粒度，针对单个Bean；启动类中的初始化更粗粒度，针对整个应用
     */
    @PostConstruct
    public void initFlowRules() {
        List<FlowRule> rules = new ArrayList<>();
        FlowRule rule = new FlowRule();
        rule.setResource("testResource"); // 设置资源名，需与 @SentinelResource 的 value 一致
        rule.setGrade(RuleConstant.FLOW_GRADE_QPS); // 限流阈值类型为 QPS
        // rule.setGrade(RuleConstant.FLOW_GRADE_THREAD); // 或者设置为线程数模式
        rule.setCount(10); // 阈值设置为 10，每秒最多10次请求
        rules.add(rule);
        FlowRuleManager.loadRules(rules); // 加载规则
    }
}
