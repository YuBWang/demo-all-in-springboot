package com.kongbai9029.threaddemo;
import com.teamdev.jxbrowser.browser.Browser;
import com.teamdev.jxbrowser.engine.Engine;
import com.teamdev.jxbrowser.engine.EngineOptions;
import com.teamdev.jxbrowser.view.javafx.BrowserView;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;
import lombok.var;

import static com.teamdev.jxbrowser.engine.RenderingMode.HARDWARE_ACCELERATED;

public class JxBrowserTest extends Application {
    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        // 创建和运行 Chromium Engine。
        EngineOptions options = EngineOptions.newBuilder(HARDWARE_ACCELERATED)
                .licenseKey("1BNDIEOFAZ1Z8R8VNNG4W07HLC9173JJW3RT0P2G9Y28L9YFFIWDBRFNFLFDQBKXAHO9ZE")
                .build();
        System.out.println(options.chromiumDir());
        var engine = Engine.newInstance(options);

        Browser browser = engine.newBrowser();
        // 加载所需的网页。
        browser.navigation().loadUrl("https://www.baidu.com");
        // 创建一个 UI 组件,
        // 用于渲染给定 Browser 实例中加载的网页内容。
        var view = BrowserView.newInstance(browser);

        var scene = new Scene(new BorderPane(view), 600, 200);
        primaryStage.setTitle("JxBrowser JavaFX");
        primaryStage.setScene(scene);
        primaryStage.show();

        // 当该 stage 即将关闭时关闭其 Engine。
        primaryStage.setOnCloseRequest(event -> engine.close());
    }
}
