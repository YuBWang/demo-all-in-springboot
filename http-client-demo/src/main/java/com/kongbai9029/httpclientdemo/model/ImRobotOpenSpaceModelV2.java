package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * IM机器人开放空间模型 V2
 * @Author: wyb
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImRobotOpenSpaceModelV2 implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 是否支持转发
     */
    private Boolean supportForward;

    /**
     * 最后消息国际化配置
     */
    private LastMessageI18n lastMessageI18n;

    /**
     * 搜索支持
     */
    private SearchSupportV2 searchSupport;
}
