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
