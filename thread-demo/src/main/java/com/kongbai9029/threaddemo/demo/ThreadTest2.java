package com.kongbai9029.threaddemo.demo;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.net.URL;

/**
 * 多线程同步下载图片
 *
 * @Author: wyb
 * @Date: 2022/7/10 17:11
 */
public class ThreadTest2 extends Thread {
    private String url;
    private String fileName;

    public ThreadTest2(String url, String fileName) {
        this.url = url;
        this.fileName = fileName;
    }


    @Override
    public void run() {
        WebDownload webDownload = new WebDownload();
        webDownload.download(url, fileName);
        System.out.println("下载了文件，文件名为：" + fileName);

    }

    public static void main(String[] args) {
        String url = "https://avatars.githubusercontent.com/u/53183903?v=4";
        ThreadTest2 threadTest1 = new ThreadTest2(url, "p1.jpg");
        ThreadTest2 threadTest2 = new ThreadTest2(url, "p2.jpg");
        ThreadTest2 threadTest3 = new ThreadTest2(url, "p3.jpg");
        threadTest1.start();
        threadTest2.start();
        threadTest3.start();

    }


}

class WebDownload {

    public void download(String url, String fileName) {
        try {
            FileUtils.copyURLToFile(new URL(url), new File(fileName));
        } catch (IOException e) {
            System.out.println("IO异常");
        }
    }


}

