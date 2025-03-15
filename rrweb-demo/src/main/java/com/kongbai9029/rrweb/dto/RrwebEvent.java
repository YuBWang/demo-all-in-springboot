package com.kongbai9029.rrweb.dto;

import java.util.Date;

/**
 * <p>标题： </p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2022</p>
 * <p>公司: 厦门象屿科技有限公司</p>
 * <p>创建日期：2022/9/5 10:38</p>
 * <p>类全名：com.kongbai9029.rrweb.dto.rrwebEvent</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
public class RrwebEvent {

    private String eventicode;

    private String event;

    private String modifier;

    public String getEventicode() {
        return eventicode;
    }

    public void setEventicode(String eventicode) {
        this.eventicode = eventicode;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getModifier() {
        return modifier;
    }

    public void setModifier(String modifier) {
        this.modifier = modifier;
    }

    public String getModifydate() {
        return modifydate;
    }

    public void setModifydate(String modifydate) {
        this.modifydate = modifydate;
    }

    private String modifydate;

}
