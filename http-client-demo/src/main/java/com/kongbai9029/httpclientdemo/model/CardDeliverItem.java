package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * deliverResults 明细
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardDeliverItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private String spaceId;

    private String spaceType;

    private Boolean success;

    private String carrierId;

    private String errorMsg;
}

