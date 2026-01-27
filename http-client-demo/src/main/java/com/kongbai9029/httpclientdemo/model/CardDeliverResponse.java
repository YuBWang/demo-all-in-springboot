package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 卡片投递响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardDeliverResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private CardDeliverResult result;

    private Boolean success;
}

