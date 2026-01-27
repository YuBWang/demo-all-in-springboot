package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 搜索支持配置 V2
 * @Author: wyb
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchSupportV2 implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 搜索图标
     */
    private String searchIcon;

    /**
     * 搜索描述
     */
    private String searchDesc;
}
