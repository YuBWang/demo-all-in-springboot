package com.kongbai9029.threaddemo.executorservice;

import java.util.concurrent.*;

public class ExecutorServiceUse {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService executorService = Executors.newSingleThreadExecutor();
//        Future<String> future = executorService.submit(new callableMode());
        Future<String> future = executorService.submit(new Callable<String>() {
            @Override
            public String call() throws Exception {
                return "匿名类实现";
            }
        });
        System.out.print("线程在执行了");
        String result = future.get();
        System.out.print(result);

    }

}

class callableMode implements Callable<String> {

    @Override
    public String call() throws Exception {
        Thread.sleep(10000);
        return "执行线程中";
    }
}
