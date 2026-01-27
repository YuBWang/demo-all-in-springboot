package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 最后消息国际化配置
 * @Author: wyb
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LastMessageI18n implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 简体中文
     */
    private String ZH_CN;
}
