package com.kongbai9029.threaddemo.demo;

/**
 * @Author: wyb
 * @Date: 2022/7/17 19:37
 * 建议线程正常停止--->利用次数，不建议死循环
 * 建议使用标志位--->设置一个标志位
 * 不要使用stop或destory
 */
public class ThreadStop implements Runnable {

    // 设置一个标识位
    private boolean flag = true;

    @Override
    public void run() {
        int i = 0;
        while (flag) {
            System.out.println("run---------Thread----" + i++);
        }
    }

    public void stop() {
        this.flag = false;
    }

    public static void main(String[] args) {
        ThreadStop threadStop = new ThreadStop();
        new Thread(threadStop).start();
        for (int i = 0; i < 1000; i++) {
            System.out.println("main---" + i);
            if (i == 900) {
                threadStop.stop();
                System.out.println("线程停止");
            }
        }
    }
}
