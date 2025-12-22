package com.example.queue.model;

/**
 * <p>标题： Redis队列状态</p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2025</p>
 * <p>公司: </p>
 * <p>创建日期：2025/11/12 16:00</p>
 * <p>类全名：cn.snsoft.component.redis.queue.model.QueueStats</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
public class QueueStats {
    /**
     * 等待队列
     */
    private final long waitingCount;
    /**
     * 执行中队列
     */
    private final long processingCount;
    /**
     * 死信队列
     */
    private final long deadLetterCount;

    /**
     * 延迟队列
     */
    private final long delayedCount;

    public QueueStats(long waitingCount, long processingCount, long deadLetterCount, long delayedCount) {
        this.waitingCount = waitingCount;
        this.processingCount = processingCount;
        this.deadLetterCount = deadLetterCount;
        this.delayedCount = delayedCount;
    }

    public long getWaitingCount() {
        return waitingCount;
    }

    public long getProcessingCount() {
        return processingCount;
    }

    public long getDeadLetterCount() {
        return deadLetterCount;
    }

    public long getTotalCount() {
        return waitingCount + processingCount + deadLetterCount + delayedCount;
    }

    public long getDelayedCount() {
        return delayedCount;
    }


    @Override
    public String toString() {
        return String.format("QueueStats{waiting=%d, processing=%d, deadLetter=%d,delayed=%d, total=%d}",
                waitingCount, processingCount, deadLetterCount, delayedCount, getTotalCount());
    }
}
