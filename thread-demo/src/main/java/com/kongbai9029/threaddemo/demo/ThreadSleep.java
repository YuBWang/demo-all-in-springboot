package com.kongbai9029.threaddemo.demo;

/**
 * @Author: wyb
 * @Date: 2022/7/17 20:06
 */
public class ThreadSleep {
    public static void main(String[] args) throws InterruptedException {
        tenDown();

    }

    public static void tenDown() throws InterruptedException {
        int num = 10;
        while(true) {
            Thread.sleep(1000);
            System.out.println(num--);
            if (num <= 0) {
                break;
            }
        }
    }
}
