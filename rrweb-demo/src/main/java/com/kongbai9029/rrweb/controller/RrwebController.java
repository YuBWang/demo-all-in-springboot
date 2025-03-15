package com.kongbai9029.rrweb.controller;

import com.kongbai9029.rrweb.dto.RrwebEvent;
import com.kongbai9029.rrweb.mapper.RrwebMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * <p>标题： </p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2022</p>
 * <p>公司: 厦门象屿科技有限公司</p>
 * <p>创建日期：2022/8/30 17:20</p>
 * <p>类全名：com.kongbai9029.rrweb.controller.RrwebController</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
@Controller
@RequestMapping("/rrweb")
public class RrwebController {

    @Autowired
    private RrwebMapper rrwebMapper;

    @ResponseBody
    @RequestMapping(value = "/event", produces = {"application/json;charset=UTF-8"})
    public String event() {
        String result = rrwebMapper.getEvent();
        return result;
    }

    @RequestMapping("/eventList")
    public String eventList(Model model) {
        List<RrwebEvent> list = rrwebMapper.getEventList();
        model.addAttribute("list", list);
        return "/replayVideo";
    }

    @RequestMapping("replayDetail")
    public String getEventById(String id, Model model) {
        model.addAttribute("eventid", id);
        return "/replayDetail";
    }

    @ResponseBody
    @RequestMapping(value = "/getEventById", produces = {"application/json;charset=UTF-8"})
    public String getEventById(@RequestParam String id) {
        String result = rrwebMapper.getEventById(id);
        return result;
    }


}
