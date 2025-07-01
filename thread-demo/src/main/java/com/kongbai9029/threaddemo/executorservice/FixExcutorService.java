package com.kongbai9029.threaddemo.executorservice;

import java.util.concurrent.*;

public class FixExcutorService {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService service = Executors.newFixedThreadPool(3);
//        Future<String> feature = service.submit(new Callable<String>() {
//            @Override
//            public String call() throws Exception {
//                return "进到具体实现方法了";
//            }
//        });
        Future<String> future1 = service.submit(new CallUse(1));
        Future<String> future2 = service.submit(new CallUse(2));
        Future<String> future3 = service.submit(new CallUse(3));
        Future<String> future4 = service.submit(new CallUse(4));
        Future<String> future5 = service.submit(new CallUse(5));

    }
}

class CallUse implements  Callable<String> {
    private int count;

    CallUse(int count){
        this.count = count;
    }

    @Override
    public String call() throws Exception {
        Thread.sleep(5000);
        System.out.print("进入具体的实现方法" + count);
       return "进入具体的实现方法" + count;
    }
}
