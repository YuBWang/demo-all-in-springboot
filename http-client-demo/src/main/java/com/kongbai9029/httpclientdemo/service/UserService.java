package com.kongbai9029.httpclientdemo.service;

import com.kongbai9029.httpclientdemo.model.User;

/**
 * @Author: wyb
 * @Date: 2022/1/11 20:33
 */
public interface UserService {
    User getUser();

    User getUser(String name);
}
