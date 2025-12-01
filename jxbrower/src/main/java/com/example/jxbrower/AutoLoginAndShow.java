package com.example.jxbrower;

import com.teamdev.jxbrowser.browser.Browser;
import com.teamdev.jxbrowser.engine.Engine;
import com.teamdev.jxbrowser.engine.EngineOptions;
import com.teamdev.jxbrowser.engine.RenderingMode;
import com.teamdev.jxbrowser.frame.Frame;
import com.teamdev.jxbrowser.navigation.Navigation;
import com.teamdev.jxbrowser.navigation.event.FrameLoadFinished;
import com.teamdev.jxbrowser.net.event.ResponseBytesReceived;
import com.teamdev.jxbrowser.view.javafx.BrowserView;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

import java.nio.charset.StandardCharsets;
// 使用JavaFX需要添加VM参数
// --module-path
//"D:\tools\bcrj\javaFX\javafx-sdk-17.0.16\lib"
//--add-modules
//javafx.controls,javafx.fxml,javafx.graphics,javafx.web

public class AutoLoginAndShow extends Application {
    private Engine engine;
    private Browser browser;

    @Override
    public void start(Stage primaryStage) {
        // 初始化JxBrowser引擎
        EngineOptions options = EngineOptions.newBuilder(RenderingMode.HARDWARE_ACCELERATED)
                .licenseKey("1BNDIEOFAZ1Z8R8VNNG4W07HLC9173JJW3RT0P2G9Y28L9YFFIWDBRFNFLFDQBKXAHO9ZE") // 替换为你的许可证密钥
                .build();

        engine = Engine.newInstance(options);
        browser = engine.newBrowser();

        // 创建JavaFX的BrowserView
        BrowserView browserView = BrowserView.newInstance(browser);

        // 设置主界面布局
        BorderPane root = new BorderPane();
        root.setCenter(browserView);

        // 设置场景和舞台
        Scene scene = new Scene(root, 1000, 700);
        primaryStage.setTitle("JxBrowser 自动登录示例");
        primaryStage.setScene(scene);
        primaryStage.show();

        // 设置页面加载完成监听器
        Navigation navigation = browser.navigation();
        navigation.on(FrameLoadFinished.class, event -> {
            String url = event.url();
            System.out.println("页面加载完成: " + url);

            // 获取当前框架
            Frame frame = event.frame();

            // 登录页面处理
            if (url.contains("http://10.91.17.16/wui/index.html#/?logintype=1&_key=coqyeb")) { // 替换为实际登录URL
                // 延迟执行以确保DOM完全加载
                frame.executeJavaScript(
                        "setTimeout(function() {" +
                                "   try {" +
                                "       document.getElementById('loginid').value = 'xhwei';" +
                                "       document.getElementById('userpassword').value = 'Xy@1234';" +
                                "       document.querySelector('button[name=\"submit\"]').click();" +
                                "       console.log('自动填写并提交表单成功');" +
                                "   } catch (e) {" +
                                "       console.error('自动登录失败:', e.message);" +
                                "   }" +
                                "}, 5000);"
                );
            }

        });

        // 监听请求
        browser.profile().network().on(ResponseBytesReceived.class, event -> {
            byte[] data = event.data();
            System.out.println("========" + event.urlRequest().url());
        });

        // 打开登录页面
        navigation.loadUrl("http://10.91.17.16/wui/index.html#/?logintype=1&_key=coqyeb");

        // 窗口关闭时清理资源
        primaryStage.setOnCloseRequest(event -> {
            engine.close();
            System.exit(0);
        });
    }

    public static void main(String[] args) {
        launch(args);
    }
}
