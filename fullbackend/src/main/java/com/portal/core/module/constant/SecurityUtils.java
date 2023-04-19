package com.portal.core.module.constant;

import com.portal.core.common.exception.ValidateException;
import com.portal.core.module.entities.User;
import com.portal.core.module.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils implements InitializingBean {
    private static SecurityUtils instance;

    @Override
    public void afterPropertiesSet() throws Exception {
        instance = this;
    }

    public static UserDetails getUserDetails() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return (UserDetails) principal;
        }
        throw new AuthenticationServiceException("Unauthorized");
    }

    public static String getUserId() {
        UserDetails details = getUserDetails();
        return details.getUsername();
    }

    public static User getUser(UserRepository repsitory) throws ValidateException {
        String userId = SecurityUtils.getUserId();

        if (StringUtils.isBlank(userId)) {
            throw new ValidateException("User không tồn tại", "User không tồn tại");
        }

        return repsitory.findByEmailOrPhoneNumber(userId,userId)
                .orElseThrow(()-> new ValidateException("User không tồn tại", "User không tồn tại"));
    }
}
