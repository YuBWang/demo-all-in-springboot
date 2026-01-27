package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 卡片数据
 * @Author: wyb
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardData implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 卡片参数映射
     */
    private CardParamMap cardParamMap;
}
