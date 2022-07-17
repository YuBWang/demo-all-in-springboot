package com.kongbai9029.threaddemo.demo;

/**
 * 多个线程同时操作同一个对象，存在并发问题
 * @Author: wyb
 * @Date: 2022/7/10 21:46
 */
public class ThreadTest4 implements Runnable {

    private int ticketNum = 10;
    @Override
    public void run() {
        while(true){
            if (ticketNum <= 0) {
                break;
            }
            System.out.println(Thread.currentThread().getName() + "--->拿到了第" + ticketNum-- + "票");
        }
    }

    public static void main(String[] args) {
        ThreadTest4 threadTest = new ThreadTest4();

        new Thread(threadTest,"用户1").start();
        new Thread(threadTest,"用户2").start();
        new Thread(threadTest,"用户3").start();
    }

}
