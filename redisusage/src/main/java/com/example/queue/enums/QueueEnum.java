package com.example.queue.enums;

/**
 * <p>标题： REDIS队列枚举</p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2025</p>
 * <p>公司: </p>
 * <p>创建日期：2025/11/25 14:04</p>
 * <p>类全名：cn.snsoft.component.redis.queue.enums.QueueEnum</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
public enum QueueEnum {

    DELIVERY_CREATE_SHIP_BY_CC("deliveryCreateShipByCC", "提货委托创建发货单队列（公司+客商维度）"),
    SHIP_PUSH_EBS_BY_C("salShipPushEbsBySCode", "发货单推EBS队列（仓库维度）");
    private final String code;

    private final String desc;

    QueueEnum(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }
}
