package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * IM机器人开放投递模型 V2
 * @Author: wyb
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImRobotOpenDeliverModelV2 implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 空间类型
     */
    private String spaceType;

    /**
     * 机器人代码
     */
    private String robotCode;
}
