package com.kongbai9029.httpclientdemo.service.impl;

import com.kongbai9029.httpclientdemo.model.User;
import com.kongbai9029.httpclientdemo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * @Author: wyb
 * @Date: 2022/1/11 20:35
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public User getUser() {
        return User.builder().name("张三").age(22).phone("12345678900")
                .address("china").build();
    }

    @Override
    public User getUser(String name) {
        String url = "http://localhost:8081/user/v1/info";
        ResponseEntity<User> responseEntity = restTemplate.getForEntity(url, User.class);
        return responseEntity.getBody();
    }
}
