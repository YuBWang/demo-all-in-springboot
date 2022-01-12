package com.kongbai9029.httpclientdemo.service.impl;

import com.kongbai9029.httpclientdemo.model.User;
import com.kongbai9029.httpclientdemo.service.UserService;
import org.springframework.stereotype.Service;

/**
 * @Author: wyb
 * @Date: 2022/1/11 20:35
 */
@Service
public class UserServiceImpl implements UserService {
    @Override
    public User getUser() {
        return User.builder().name("张三").age(22).phone("12345678900")
                .address("china").build();
    }
}
