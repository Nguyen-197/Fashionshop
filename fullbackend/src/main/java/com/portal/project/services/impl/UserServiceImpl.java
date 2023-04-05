package com.portal.project.services.impl;

import com.portal.project.utils.CommonUtil;
import com.portal.project.dtos.UserDTO;
import com.portal.project.forms.UserForm;
import com.portal.project.models.User;
import com.portal.project.repositories.UserRepository;
import com.portal.project.services.UserService;
import com.portal.project.utils.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO save(UserForm form) {
        User userProfile = ObjectMapper.map(form, User.class);
        if (CommonUtil.NVL(userProfile.getUserId()) > 0) {
            userProfile.setUpdatedAt(new Date());
        } else {
            userProfile.setCreatedAt(new Date());
        }
        userProfile = userRepository.save(userProfile);
        return ObjectMapper.map(userProfile, UserDTO.class);
    }

    
}
