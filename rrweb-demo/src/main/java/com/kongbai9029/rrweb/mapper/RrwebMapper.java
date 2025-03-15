package com.kongbai9029.rrweb.mapper;
import com.kongbai9029.rrweb.dto.RrwebEvent;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * <p>标题： </p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2022</p>
 * <p>公司: 厦门象屿科技有限公司</p>
 * <p>创建日期：2022/8/30 17:11</p>
 * <p>类全名：com.kongbai9029.rrweb.mapper.RrwebMapper</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
@Mapper
public interface RrwebMapper {

    String getEvent();

    List<RrwebEvent> getEventList();

    String getEventById(String id);
}
