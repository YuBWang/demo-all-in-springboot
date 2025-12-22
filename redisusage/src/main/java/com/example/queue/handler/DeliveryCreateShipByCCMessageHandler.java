package com.example.queue.handler;


import com.alibaba.fastjson.JSONObject;
import com.example.queue.model.QueueMessage;
import com.example.queue.util.QueueUtil;


import java.util.Map;

/**
 * <p>标题： 提货委托创建发货单队列（公司+客商维度）</p>
 * <p>功能： </p>
 * <p>版权： Copyright (c) 2025</p>
 * <p>公司: </p>
 * <p>创建日期：2025/11/25 14:44</p>
 * <p>类全名：snsoft.xy.handler.DeliveryCreateShipByCCMessageHandler</p>
 * <p>
 * 作者：xywyb
 * 初审：
 * 复审：
 *
 * @version 1.0
 */
public class DeliveryCreateShipByCCMessageHandler implements MessageHandler {

    @Override
    public boolean handleMessage(String queueName, QueueMessage message, final Map<String, Object> envParams) {
        JSONObject obj = message.getData();

        //单据内码
        String sourceicode = obj.getString("sourceicode");
        //来源单号
        String sourcecode = obj.getString("sourcecode");
        //来源单据号
        String sourcesheetcode = obj.getString("sourcesheetcode");
        //公司
        String corpbcode = obj.getString("corpbcode");
        //客商
        String mdmid = obj.getString("mdmid");

        boolean flag = QueueUtil.setDeliveryCreateShipByCCKey(corpbcode, mdmid);

        if (flag) {
            boolean error = false;
            try {

            } catch (Exception e) {
                error = true;
                throw new RuntimeException(e.getMessage());
            } finally {

                //创建完解锁
                QueueUtil.deleteDeliveryCreateShipByCCKey(corpbcode, mdmid);
            }

        } else {
            return false;
        }
    return true;

    }

    @Override
    public void onHandleFailed(String queueName, QueueMessage message, Map<String, Object> envParams, Exception exception) {

    }

    @Override
    public boolean moveWaitingOnUnAck(String queueName, QueueMessage message, Map<String, Object> envParams) {
        return true;
    }
}
