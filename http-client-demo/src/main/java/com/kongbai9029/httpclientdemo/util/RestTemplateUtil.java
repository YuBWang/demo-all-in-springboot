package com.kongbai9029.httpclientdemo.util;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.util.CollectionUtils;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * RestTemplate 请求调用工具类
 * 封装 GET、POST、PUT、DELETE、PATCH 等常用 HTTP 请求方式
 *
 * @author wyb
 */
public class RestTemplateUtil {

    private final RestTemplate restTemplate;

    public RestTemplateUtil(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // ==================== GET ====================

    /**
     * GET 请求，返回指定类型
     *
     * @param url  请求地址
     * @param clazz 响应体类型
     * @return 响应体对象
     */
    public <T> T get(String url, Class<T> clazz) {
        return get(url, null, null, clazz);
    }

    /**
     * GET 请求，带 URL 占位参数，如 /user/{id}
     *
     * @param url   请求地址，占位符如 {id}
     * @param clazz 响应体类型
     * @param args  按顺序填充占位符 {0}、{1} 或 {id}、{name}
     * @return 响应体对象
     */
    public <T> T get(String url, Class<T> clazz, Object... args) {
        return restTemplate.getForObject(url, clazz, args);
    }

    /**
     * GET 请求，带 Map 参数填充占位符
     *
     * @param url    请求地址，占位符如 {id}、{name}
     * @param params 参数 Map，key 对应占位符名称
     * @param clazz  响应体类型
     * @return 响应体对象
     */
    public <T> T get(String url, Map<String, ?> params, Class<T> clazz) {
        if (CollectionUtils.isEmpty(params)) {
            return restTemplate.getForObject(url, clazz);
        }
        return restTemplate.getForObject(url, clazz, params);
    }

    /**
     * GET 请求，自定义请求头
     *
     * @param url     请求地址
     * @param headers 请求头，可为 null
     * @param clazz   响应体类型
     * @return 响应体对象
     */
    public <T> T get(String url, HttpHeaders headers, Class<T> clazz) {
        return get(url, headers, null, clazz);
    }

    /**
     * GET 请求，自定义请求头 + URL 参数
     *
     * @param url     请求地址
     * @param headers 请求头，可为 null
     * @param params  URL 占位参数，可为 null
     * @param clazz   响应体类型
     * @return 响应体对象
     */
    public <T> T get(String url, HttpHeaders headers, Map<String, ?> params, Class<T> clazz) {
        HttpEntity<?> entity = new HttpEntity<>(headers != null ? headers : new HttpHeaders());
        if (CollectionUtils.isEmpty(params)) {
            ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.GET, entity, clazz);
            return response.getBody();
        }
        ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.GET, entity, clazz, params);
        return response.getBody();
    }

    /**
     * GET 请求，返回 ResponseEntity（可获取状态码、响应头等）
     */
    public <T> ResponseEntity<T> getForEntity(String url, Class<T> clazz) {
        return restTemplate.getForEntity(url, clazz);
    }

    public <T> ResponseEntity<T> getForEntity(String url, Map<String, ?> params, Class<T> clazz) {
        if (CollectionUtils.isEmpty(params)) {
            return restTemplate.getForEntity(url, clazz);
        }
        return restTemplate.getForEntity(url, clazz, params);
    }

    // ==================== POST ====================

    /**
     * POST 请求，JSON 请求体
     *
     * @param url  请求地址
     * @param body 请求体对象（会序列化为 JSON）
     * @param clazz 响应体类型
     * @return 响应体对象
     */
    public <T> T post(String url, Object body, Class<T> clazz) {
        return post(url, body, null, clazz);
    }

    /**
     * POST 请求，JSON 请求体 + 自定义请求头
     */
    public <T> T post(String url, Object body, HttpHeaders headers, Class<T> clazz) {
        HttpHeaders h = defaultJsonHeaders(headers);
        HttpEntity<Object> entity = new HttpEntity<>(body, h);
        if (body == null) {
            entity = new HttpEntity<>(h);
        }
        ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.POST, entity, clazz);
        return response.getBody();
    }

    /**
     * POST 请求，表单提交 (application/x-www-form-urlencoded)
     *
     * @param url    请求地址
     * @param params 表单参数
     * @param clazz  响应体类型
     * @return 响应体对象
     */
    public <T> T postForm(String url, MultiValueMap<String, String> params, Class<T> clazz) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.POST, entity, clazz);
        return response.getBody();
    }

    /**
     * POST 请求，返回 ResponseEntity
     */
    public <T> ResponseEntity<T> postForEntity(String url, Object body, Class<T> clazz) {
        HttpHeaders headers = defaultJsonHeaders(null);
        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        return restTemplate.exchange(url, HttpMethod.POST, entity, clazz);
    }

    // ==================== PUT ====================

    /**
     * PUT 请求，JSON 请求体
     */
    public <T> T put(String url, Object body, Class<T> clazz) {
        return put(url, body, null, clazz);
    }

    /**
     * PUT 请求，JSON 请求体 + 自定义请求头
     */
    public <T> T put(String url, Object body, HttpHeaders headers, Class<T> clazz) {
        HttpHeaders h = defaultJsonHeaders(headers);
        HttpEntity<Object> entity = new HttpEntity<>(body, h);
        ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.PUT, entity, clazz);
        return response.getBody();
    }

    /**
     * PUT 请求，无响应体
     */
    public void put(String url, Object body) {
        put(url, body, (HttpHeaders) null);
    }

    public void put(String url, Object body, HttpHeaders headers) {
        HttpHeaders h = defaultJsonHeaders(headers);
        HttpEntity<Object> entity = new HttpEntity<>(body, h);
        restTemplate.exchange(url, HttpMethod.PUT, entity, Void.class);
    }

    // ==================== DELETE ====================

    /**
     * DELETE 请求，无请求体
     */
    public void delete(String url) {
        delete(url, (Map<String, ?>) null);
    }

    /**
     * DELETE 请求，带 URL 占位参数
     */
    public void delete(String url, Map<String, ?> params) {
        if (CollectionUtils.isEmpty(params)) {
            restTemplate.delete(url);
        } else {
            restTemplate.delete(url, params);
        }
    }

    /**
     * DELETE 请求，带可变参数
     */
    public void delete(String url, Object... uriVariables) {
        restTemplate.delete(url, uriVariables);
    }

    /**
     * DELETE 请求，返回响应体
     */
    public <T> T delete(String url, Class<T> clazz) {
        ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.DELETE, null, clazz);
        return response.getBody();
    }

    public <T> T delete(String url, Map<String, ?> params, Class<T> clazz) {
        HttpEntity<?> entity = new HttpEntity<>(new HttpHeaders());
        ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, clazz, params);
        return response.getBody();
    }

    // ==================== PATCH ====================

    /**
     * PATCH 请求，JSON 请求体
     */
    public <T> T patch(String url, Object body, Class<T> clazz) {
        return patch(url, body, null, clazz);
    }

    public <T> T patch(String url, Object body, HttpHeaders headers, Class<T> clazz) {
        HttpHeaders h = defaultJsonHeaders(headers);
        HttpEntity<Object> entity = new HttpEntity<>(body, h);
        ResponseEntity<T> response = restTemplate.exchange(url, HttpMethod.PATCH, entity, clazz);
        return response.getBody();
    }

    // ==================== Exchange（通用） ====================

    /**
     * 通用 exchange，可自定义 HttpMethod、请求体、请求头
     */
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, Object body,
                                          HttpHeaders headers, Class<T> clazz) {
        HttpEntity<Object> entity = new HttpEntity<>(body, headers != null ? headers : new HttpHeaders());
        return restTemplate.exchange(url, method, entity, clazz);
    }

    /**
     * 通用 exchange，带 URL 参数
     */
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, Object body,
                                          HttpHeaders headers, Map<String, ?> params, Class<T> clazz) {
        HttpEntity<Object> entity = new HttpEntity<>(body, headers != null ? headers : new HttpHeaders());
        if (CollectionUtils.isEmpty(params)) {
            return restTemplate.exchange(url, method, entity, clazz);
        }
        return restTemplate.exchange(url, method, entity, clazz, params);
    }

    /**
     * 通用 exchange，支持泛型类型（如 List、Map 等）
     * 例如：new ParameterizedTypeReference&lt;List&lt;User&gt;&gt;() {}
     */
    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, Object body,
                                          HttpHeaders headers, ParameterizedTypeReference<T> typeRef) {
        HttpEntity<Object> entity = new HttpEntity<>(body, headers != null ? headers : new HttpHeaders());
        return restTemplate.exchange(url, method, entity, typeRef);
    }

    // ==================== 便捷方法：构建 JSON 请求头 ====================

    /**
     * 默认 JSON 请求头，若传入 headers 则合并并设置 Content-Type
     */
    private HttpHeaders defaultJsonHeaders(HttpHeaders headers) {
        HttpHeaders h = new HttpHeaders();
        if (headers != null) {
            headers.forEach(h::addAll);
        }
        if (!h.containsKey(HttpHeaders.CONTENT_TYPE)) {
            h.setContentType(MediaType.APPLICATION_JSON);
        }
        return h;
    }

    /**
     * 快速构建常用请求头
     *
     * @param contentType 如 MediaType.APPLICATION_JSON
     * @param pairs       key-value 交替，如 "Authorization", "Bearer xxx", "X-Custom", "value"
     */
    public static HttpHeaders headers(MediaType contentType, String... pairs) {
        HttpHeaders h = new HttpHeaders();
        if (contentType != null) {
            h.setContentType(contentType);
        }
        if (pairs != null && pairs.length >= 2) {
            for (int i = 0; i < pairs.length - 1; i += 2) {
                h.add(pairs[i], pairs[i + 1]);
            }
        }
        return h;
    }

    /**
     * 构建 JSON + 自定义 Header 的 Map，便于链式添加
     */
    public static HttpHeaders jsonHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }

    /**
     * 从 Map 构建 HttpHeaders
     */
    public static HttpHeaders fromMap(Map<String, String> headerMap) {
        HttpHeaders h = new HttpHeaders();
        if (headerMap != null) {
            headerMap.forEach(h::add);
        }
        return h;
    }
}
