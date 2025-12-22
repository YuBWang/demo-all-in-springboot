package com.example.controller;

import com.example.dto.Compony;
import com.example.queue.consumer.QueueConsumer;
import com.example.queue.util.QueueUtil;
import com.example.service.QueueConsumerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/queue")
public class QueueConsumerController {
    @Autowired
    private QueueConsumerService queueConsumerService;

    @PostMapping("/product")
    public String consumer(@RequestBody Compony compony) {
        QueueUtil.sendDeliveryCreateShipByCCQueue(compony.getCorpbcode(), compony.getMdmid(), compony.getSourceicode(),
                compony.getSourcecode(), compony.getSourcesheetcode());
        return "success";
    }

    @GetMapping("/consumer")
    public String consumer() {
        queueConsumerService.consumer();
        return "success";
    }
}
