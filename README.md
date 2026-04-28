# demo-all-in-springboot

基于 Spring Boot 的多模块示例项目，集成了多个技术栈的 Demo 实现，涵盖 HTTP 客户端、自定义注解、消息队列、搜索引擎、线程池、Redis 队列、屏幕录制、浏览器自动化及通用工具类。

## 模块概览

| 模块 | 说明 | 技术栈 |
|------|------|--------|
| `http-client-demo` | HTTP 客户端调用示例 | RestTemplate, OkHttp, Redisson, 钉钉开放平台 API |
| `custom-annotation-demo` | 自定义注解与 AOP 实践 | Spring AOP, 拦截器, 防重复提交 |
| `mq-usage` | ActiveMQ 消息队列使用 | ActiveMQ, JmsTemplate, JMS 分组消息 |
| `redisusage` | 基于 Redis 的消息队列 | Redis List/ZSet, 延迟队列, 死信队列, Lua 脚本 |
| `elasticsearch-usage` | Excel 数据导入 Elasticsearch | ES RestHighLevelClient, Apache POI |
| `thread-demo` | 线程与线程池使用 | 线程池配置, ExecutorService, 静态代理 |
| `rrweb-demo` | 用户行为录制与回放 | rrweb.js, Thymeleaf, MySQL |
| `jxbrower` | JxBrowser 浏览器自动登录 | JxBrowser, JavaFX |
| `common-util` | 通用工具类与限流 | 反射工具, 对象字段比较, Guava/Redisson/Sentinel 限流 |

---

## 模块详情

### http-client-demo

HTTP 客户端调用集成示例，调用钉钉开放平台接口发送消息卡片。

- `RestTemplateController` — RestTemplate GET/POST/Header 多种请求方式
- `RestTemplateExampleController` / `RestIntercepttorController` — RestTemplate 拦截器与高级用法
- `OkHttpController` — OkHttp 请求示例
- `MessageSendController` — 调用钉钉 API 获取 Token 并发送消息卡片，集成 Redisson 限流
- `HttpClientController` / `UserController` — 基础 HTTP 客户端示例

### custom-annotation-demo

自定义注解及其 AOP/Interceptor 实现。

- `@LoginRequired` — 登录校验注解，通过拦截器实现
- `@PreventDuplicateSubmit` — 防重复提交注解，基于时间窗口（默认 3 秒）
- `@MyLog` — 操作日志注解，通过 AOP 切面实现
- `DuplicateSubmitInterceptor` — 防重复提交流量拦截器
- `LoginInterceptor` — 登录态校验拦截器

### mq-usage

ActiveMQ 消息队列使用示例。

- `ActivemqDemoService` — 文本/JSON 消息发送
- `MessageListener` — 消息监听与消费
- `MessageController` — REST 接口触发消息发送
- 支持 `JMSXGroupID` 分组消息

### redisusage

基于 Redis 的完整消息队列实现，支持多种队列类型和消费模型。

- **队列类型**: 等待队列、处理中队列、延迟队列、死信队列
- **核心功能**:
  - FIFO 消息入队出队（`rightPush` / `leftPop`）
  - 延迟消息调度（基于 ZSet 时间戳排序）
  - 消息超时重试与死信转移
  - 消费确认与 Lua 脚本原子化删除
  - 批处理管道操作（`executePipelined`）
  - 游标扫描（`SCAN`）避免大 Key 阻塞
  - 队列统计（各队列消息数）
- `QueueConsumer` — 可配置的后台消费者框架
- `QueueManager` — 队列核心操作封装
- 支持定时清理空队列

### elasticsearch-usage

Excel 数据批量导入 Elasticsearch。

- 通过 Apache POI 读取 Excel（自动识别 `.xls` / `.xlsx`）
- 使用 `RestHighLevelClient` 批量写入 ES 索引
- 支持日期字段解析、安全单元格值读取

### thread-demo

线程与线程池示例。

- `ThreadPoolConfig` — 线程池配置（核心/最大线程数、队列、拒绝策略）
- `ThreadPoolController` — 线程池任务提交 REST 接口
- `ExecutorServiceUse` / `FixExcutorService` — ExecutorService 使用示例
- `ThreadTest1`~`ThreadTest4` — 线程创建与基础操作
- `ThreadSleep` / `ThreadStop` — 线程睡眠与停止
- `StacticProxy` — 静态代理模式示例

### rrweb-demo

基于 [rrweb](https://github.com/rrweb-io/rrweb) 的用户行为录制与回放系统。

- 录制用户操作（点击、输入、滚动等）并保存到 MySQL
- 回放录制的用户会话
- 用户注册、登录、密码找回功能
- 基于 Thymeleaf 的服务端渲染前端

### jxbrower

使用 JxBrowser 实现 Java 桌面应用的浏览器自动登录。

- JavaFX 集成 Chromium 浏览器内核
- 自动填充表单并执行登录操作
- 基于硬件加速渲染模式

### common-util

通用工具类与限流组件。

- `ApiRateLimit` — Redisson 分布式限流
- `GuavaRateLimit` — Guava 本地限流
- `SentinelConfig` / `SentinelController` — Sentinel 流控配置
- `ReflectionUtil` — 反射工具（方法获取、私有方法调用、泛型）
- `ObjectFieldComparator` — 对象新旧字段差异比较

## 构建与运行

### 环境要求

- JDK 1.8+（部分模块需要 JDK 17）
- Maven 3.6+
- Redis（redisusage / common-util 模块需要）
- ActiveMQ（mq-usage 模块需要）
- Elasticsearch（elasticsearch-usage 模块需要）
- MySQL（rrweb-demo 模块需要）

### 构建

```bash
# 构建全部模块
mvn clean package

# 单模块构建
mvn clean package -pl redisusage -am
```

### 注意事项

- `jxbrower` 模块需要有效的 JxBrowser 许可证密钥
- `http-client-demo` 中的钉钉 API 调用需要配置有效的 access token
- 各模块的数据库/中间件连接配置请参考对应的 `application.yml`
