package com.kongbai9029.threaddemo.demo;

/**
 * @Author: wyb
 * @Date: 2022/7/10 16:01
 */
// 创建线程方式一 继承Thread类，重写run()方法，调用start开启线程
public class ThreadTest1 extends Thread {

    @Override
    public void run() {
        // run方法线程体
        for (int i = 0; i < 10; i++) {
            System.out.println("run方法： " + i);
        }

    }

    public static void main(String[] args) {
        ThreadTest1 threadTest = new ThreadTest1();
        threadTest.start();
        for (int i = 0; i < 200; i++) {
            System.out.println("main方法： " + i);
        }

    }


}
