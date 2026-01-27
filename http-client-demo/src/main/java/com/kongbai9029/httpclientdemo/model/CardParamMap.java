package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 卡片参数映射
 * @Author: wyb
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardParamMap implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 创建日期
     */
    private String createDate;

    /**
     * 系统名称
     */
    private String sysName;

    /**
     * 应用URL（专属钉钉单点链接格式）
     */
    private String appUrl;

    /**
     * PC端URL（专属钉钉单点链接格式）
     */
    private String pcUrl;

    /**
     * 创建人
     */
    private String creator;

    /**
     * 标题
     */
    private String title;

    /**
     * 姓氏
     */
    private String lastname;

    /**
     * 内容
     */
    private String content;
}
