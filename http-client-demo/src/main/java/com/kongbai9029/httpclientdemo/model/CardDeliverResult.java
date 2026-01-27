package com.kongbai9029.httpclientdemo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * result 节点
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardDeliverResult implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<CardDeliverItem> deliverResults;

    private String outTrackId;
}

