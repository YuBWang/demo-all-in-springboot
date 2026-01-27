package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 卡片请求实体类 V2
 * @Author: wyb
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardRequestV2 implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 卡片模板ID
     */
    private String cardTemplateId;

    /**
     * 外部追踪ID（需要强唯一性策略，保证全局唯一）
     */
    private String outTrackId;

    /**
     * 回调类型
     */
    private String callbackType;

    /**
     * 卡片数据
     */
    private CardData cardData;

    /**
     * IM机器人开放空间模型
     */
    private ImRobotOpenSpaceModelV2 imRobotOpenSpaceModel;

    /**
     * 开放空间ID（可以发送多人账号）
     */
    private String openSpaceId;

    /**
     * IM机器人开放投递模型
     */
    private ImRobotOpenDeliverModelV2 imRobotOpenDeliverModel;

    /**
     * 用户ID类型
     */
    private Integer userIdType;
}
