package com.kongbai9029.httpclientdemo.controller;

import com.kongbai9029.httpclientdemo.model.*;
import com.kongbai9029.httpclientdemo.util.RestTemplateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("message")
public class MessageSendController
{

    @Autowired
    private RestTemplateUtil restUtil;

    @PostMapping("getToken")
    public String getToken(@RequestBody TokenRequestParam param) {
        String url = "https://api.dingtalk.com/v1.0/oauth2/accessToken";
        TokenDto response =restUtil.post(url,param, TokenDto.class);
        return response.getAccessToken();
    }

    @PostMapping("sendmessage")
    public String sendMessage(@RequestBody CardRequestV2 cardRequestV2) {
        String url = "https://api.dingtalk.com/v1.0/card/instances/createAndDeliver";
//        CardRequestV2 cardRequest = CardRequestV2.builder()
//                .userId("815836836")
//                .cardTemplateId("c8ed7ad5-b665-4a86-9d14-7430ad773fb7.schema")
//                .outTrackId("E8-c8ed7ad5-b665-4a86-9d14-7430ad773fb7776676555")
//                .callbackType("STREAM")
//                .cardData(CardData.builder().cardParamMap(CardParamMap.builder().createDate("2026-01-01").title("测试用例").build()).build())
//                .imRobotOpenSpaceModel(ImRobotOpenSpaceModelV2.builder().build())
//                .openSpaceId("openSpaceId")
//                .imRobotOpenDeliverModel(ImRobotOpenDeliverModelV2.builder().build()).build();
          HttpHeaders httpHeaders = new HttpHeaders();
          httpHeaders.add("x-acs-dingtalk-access-token", "76bd2b9565f73c1ea43c976fdf31f42b");
        CardDeliverResponse resultParamsDTO = restUtil.post(url,cardRequestV2,httpHeaders,CardDeliverResponse.class);
          return resultParamsDTO.getResult().getDeliverResults().get(0).getCarrierId();
    }

}
