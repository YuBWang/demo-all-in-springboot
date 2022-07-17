package com.kongbai9029.threaddemo.demo;

/**
 * 线程底部的实现原理
 * @Author: wyb
 * @Date: 2022/7/17 16:50
 * 静态代理模式总结：
 * 代理对象和真实对象都要实现同一个接口
 * 代理对象要代理真实对象
 *
 * 好处：
 * 代理对象可以做很多真实对象做不了的事
 * 真实对象专注做自己的事
 */
public class StacticProxy {
    public static void main(String[] args) {
        // 对线程
        new Thread(() -> System.out.println("")).start();
        // 静态代理
        new Intermediary(new You()).rent();
    }
}

interface RentHouse {
    void rent();
}

class You implements RentHouse {
    @Override
    public void rent() {
        System.out.println("我，找房子");
    }
}

// 代理角色
class Intermediary implements RentHouse {
    // 代理谁
    private RentHouse target;

    Intermediary(RentHouse rentHouse) {
        this.target = rentHouse;
    }

    @Override
    public void rent() {
        before();
        // 真实角色
        this.target.rent();
        after();
    }

    public void before() {
        System.out.println("查看房源");
    }

    public void after() {
        System.out.println("去签合同");
    }

}



