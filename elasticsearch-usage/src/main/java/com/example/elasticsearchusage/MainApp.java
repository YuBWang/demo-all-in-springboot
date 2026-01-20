package com.example.elasticsearchusage;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.RestClient;
import org.apache.http.HttpHost;

import java.io.IOException;

public class MainApp {
    public static void main(String[] args) {
        // 1. 初始化Elasticsearch客户端 (连接你本地的Docker ES)
        RestHighLevelClient client = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        ExcelToElasticsearchImporter importer = new ExcelToElasticsearchImporter(client);
        try {
            // 2. 指定Excel文件路径和要导入的索引名
            String excelFilePath = "D:\\运维记录\\202301运维.xlsx"; // 你的Excel文件路径
            String indexName = "sn_yw";
            // 3. 执行导入
            importer.importExcelToEs(excelFilePath, indexName);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                client.close(); // 关闭客户端连接
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
