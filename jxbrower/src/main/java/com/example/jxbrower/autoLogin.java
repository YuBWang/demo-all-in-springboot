package com.example.jxbrower;

import com.teamdev.jxbrowser.browser.Browser;
import com.teamdev.jxbrowser.engine.Engine;
import com.teamdev.jxbrowser.engine.EngineOptions;
import com.teamdev.jxbrowser.engine.RenderingMode;
import com.teamdev.jxbrowser.frame.Frame;
import com.teamdev.jxbrowser.navigation.Navigation;
import com.teamdev.jxbrowser.navigation.event.FrameLoadFinished;
import com.teamdev.jxbrowser.navigation.event.LoadFinished;
import com.teamdev.jxbrowser.view.javafx.BrowserView;
import com.teamdev.jxbrowser.zoom.ZoomLevel;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

import java.util.concurrent.atomic.AtomicInteger;

public class autoLogin extends Application {
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
        browser.navigation().on(LoadFinished.class, event -> {
            browser.zoom().level(ZoomLevel.P_75);

            String currentUrl = browser.url();

            AtomicInteger dashboardReloadCount = new AtomicInteger(0);
            if (currentUrl.contains("/dashboard") && dashboardReloadCount.get() < 1) {
                // 如果跳转到 /dashboard 页面，刷新页面
                browser.mainFrame().ifPresent(frame -> {
                    frame.executeJavaScript("window.location.reload();");
                    dashboardReloadCount.getAndIncrement();
                });
            }

            if (currentUrl.contains("/login")) {
                // 如果是登录页面，执行自动登录逻辑
                browser.mainFrame().ifPresent(frame -> {
                    String jsCode = "setTimeout(function() {" +
                            "  var usernameField = document.querySelector(\"input[type='text'][placeholder='请输入用户名']\");" +
                            "  if (usernameField) {" +
                            "    usernameField.value = 'admin';" +
                            "    var inputEvent = new Event('input', { bubbles: true });" +
                            "    var changeEvent = new Event('change', { bubbles: true });" +
                            "    usernameField.dispatchEvent(inputEvent);" +
                            "    usernameField.dispatchEvent(changeEvent);" +
                            "  }" +

                            "  var passwordField = document.querySelector(\"input[type='password'][placeholder='请输入密码']\");" +
                            "  if (passwordField) {" +
                            "    passwordField.value = 'admin-hertzbeat';" +
                            "    var inputEvent = new Event('input', { bubbles: true });" +
                            "    var changeEvent = new Event('change', { bubbles: true });" +
                            "    passwordField.dispatchEvent(inputEvent);" +
                            "    passwordField.dispatchEvent(changeEvent);" +
                            "  }" +
                            "}, 1000);" +

                            "setTimeout(function() {" +
                            "  var submitButton = document.querySelector(\"button[type='submit']\");" +
                            "  if (submitButton) submitButton.click();" +
                            "}, 3000);";

                    frame.executeJavaScript(jsCode);
                });
            }
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
