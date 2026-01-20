package com.example.elasticsearchusage;

import com.example.elasticsearchusage.dto.SnYwData;
import org.apache.poi.ss.usermodel.*;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.xcontent.XContentType;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.*;
public class ExcelToElasticsearchImporter {
    private final RestHighLevelClient esClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ExcelToElasticsearchImporter(RestHighLevelClient esClient) {
        this.esClient = esClient;
    }

    public void importExcelToEs(String filePath, String indexName) throws Exception {
        // 1. 读取并解析Excel文件
        List<SnYwData> dataList = readExcelData(filePath);

        // 2. 转换为ES批量请求
        BulkRequest bulkRequest = createBulkRequest(dataList, indexName);

        // 3. 执行批量导入
        if (bulkRequest.numberOfActions() > 0) {
            BulkResponse bulkResponse = esClient.bulk(bulkRequest, RequestOptions.DEFAULT);
            if (bulkResponse.hasFailures()) {
                System.err.println("批量导入部分失败: " + bulkResponse.buildFailureMessage());
            } else {
                System.out.println("成功导入 " + dataList.size() + " 条数据到索引 " + indexName);
            }
        }
    }

    private List<SnYwData> readExcelData(String filePath) throws Exception {
        List<SnYwData> dataList = new ArrayList<>();
        FileInputStream fis = new FileInputStream(filePath);

        // 自动判断Excel版本，创建工作簿对象
        Workbook workbook = WorkbookFactory.create(fis);
        Sheet sheet = workbook.getSheetAt(0); // 读取第一个工作表
        Iterator<Row> rowIterator = sheet.iterator();

        // 假设第一行是表头，跳过它
        if (rowIterator.hasNext()) rowIterator.next();

        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            SnYwData data = new SnYwData();

            // 根据Excel列顺序映射到对象字段（需根据你的Excel结构调整列索引）
            data.setPms(getCellStringValue(row.getCell(0)));
            data.setCode(getCellStringValue(row.getCell(1)));
            data.setProblem_description(getCellStringValue(row.getCell(2)));
            data.setProblem_reason(getCellStringValue(row.getCell(3)));
            data.setSolution(getCellStringValue(row.getCell(4)));
            // 处理日期字段
            Cell dateCell = row.getCell(5);
            if (dateCell != null) {
                if (dateCell.getCellType() == CellType.NUMERIC &&
                        DateUtil.isCellDateFormatted(dateCell)) {
                    data.setCreation_date(dateCell.getDateCellValue());
                }
            }
            dataList.add(data);
        }
        workbook.close();
        fis.close();
        return dataList;
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        // 根据单元格类型安全地获取字符串值
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return new SimpleDateFormat("yyyy-MM-dd").format(cell.getDateCellValue());
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA: return cell.getCellFormula();
            default: return "";
        }
    }

    private BulkRequest createBulkRequest(List<SnYwData> dataList, String indexName) throws Exception {
        BulkRequest bulkRequest = new BulkRequest();
        for (SnYwData data : dataList) {
            // 将Java对象转换为JSON
            String json = objectMapper.writeValueAsString(data);
            // 创建索引请求，如果需要，可以指定文档ID，例如 data.getCode()
            IndexRequest indexRequest = new IndexRequest(indexName)
                    .source(json, XContentType.JSON);
            bulkRequest.add(indexRequest);
        }
        return bulkRequest;
    }
}
