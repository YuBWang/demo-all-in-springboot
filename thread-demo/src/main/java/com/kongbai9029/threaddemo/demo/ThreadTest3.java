package com.kongbai9029.threaddemo.demo;

/**
 * 创建线程方式2，实现Runable接口，重写run方法，执行线程需要丢入runable接口实现类，调用start
 * @Author: wyb
 * @Date: 2022/7/10 21:19
 */
public class ThreadTest3 implements Runnable{
    @Override
    public void run() {
        // run方法线程体
        for (int i = 0; i < 10; i++) {
            System.out.println("run方法： " + i);
        }

    }

    public static void main(String[] args) {
        // 创建runable接口的实现类对象
        ThreadTest3 threadTest = new ThreadTest3();
        // 创建线程对象，通过线程对象来开启我们的线程
        Thread thread = new Thread(threadTest);
        thread.start();
        // new Thread(threadTest).start();
        for (int i = 0; i < 200; i++) {
            System.out.println("main方法： " + i);
        }

    }
}
