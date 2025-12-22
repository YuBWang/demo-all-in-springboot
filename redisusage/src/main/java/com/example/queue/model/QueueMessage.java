package com.example.queue.model;

import com.alibaba.fastjson.JSONObject;

import java.io.Serializable;
import java.util.UUID;

/**
 * <p>标题： Redis队列消息体</p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2025</p>
 * <p>公司: </p>
 * <p>创建日期：2025/11/12 15:58</p>
 * <p>类全名：com.example.queue.model.QueueMessage</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
public class QueueMessage implements Serializable {
    private static final long serialVersionUID = -6272738649671041041L;
    private String id;
    private JSONObject data;
    private Long createTime;
    private Long startProcessTime;

    public QueueMessage() {
        this.id = UUID.randomUUID().toString();
        this.createTime = System.currentTimeMillis();
    }

    public QueueMessage(JSONObject data) {
        this();
        this.data = data;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public JSONObject getData() {
        return data;
    }

    public void setData(JSONObject data) {
        this.data = data;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getStartProcessTime() {
        return startProcessTime;
    }

    public void setStartProcessTime(Long startProcessTime) {
        this.startProcessTime = startProcessTime;
    }

    @Override
    public String toString() {
        return "QueueMessage{" +
                "id='" + id + '\'' +
                ", data=" + data +
                ", createTime=" + createTime +
                ", startProcessTime=" + startProcessTime +
                '}';
    }
}
