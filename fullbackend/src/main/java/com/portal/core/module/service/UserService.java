package com.portal.core.module.service;

import com.portal.core.common.base.dao.CRUDDao;
import com.portal.core.common.base.service.CRUDService;
import com.portal.core.common.exception.ValidateException;
import com.portal.core.common.result.DataTableResults;
import com.portal.core.common.utils.CommonUtils;
import com.portal.core.common.utils.Constants;
import com.portal.core.module.constant.SecurityUtils;
import com.portal.core.module.dto.UserForm;
import com.portal.core.module.entities.User;
import com.portal.core.module.repository.RoleRepository;
import com.portal.core.module.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;

@Service
public class UserService  extends CRUDService<User, UserForm> {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MailService mailService;


    @Override
    protected CRUDDao<User, Long> getBaseDao() {
        return userRepository;
    }

    @Override
    protected void validateBeforeSave(User entity, UserForm form) throws ValidateException {
        List<User> lstConfilict;
        List<User> lstPhoneNumberConfilict;
        if (CommonUtils.NVL(entity.getId()).equals(0L)) {
            lstConfilict = userRepository.findConfilictByEmail(form.getEmail());
            lstPhoneNumberConfilict = userRepository.findConfilictByPhoneNumber(form.getPhoneNumber());
        } else {
            lstConfilict = userRepository.findConfilictByEmail(form.getId(), form.getEmail());
            lstPhoneNumberConfilict = userRepository.findConfilictByPhoneNumber(form.getId(), form.getPhoneNumber());
        }
        if(!CommonUtils.isNullOrEmpty(lstConfilict)) {
            throw new ValidateException(Constants.RESPONSE_CODE.DUBLICATE_EMAIL,"Email already exists");
        }
        if(!CommonUtils.isNullOrEmpty(lstPhoneNumberConfilict)) {
            throw new ValidateException(Constants.RESPONSE_CODE.DUBLICATE_PHONENUMBER,"PhoneNumber already exists");
        }
        if(StringUtils.isNotEmpty(form.getPassword())) {
            String passwordHash = passwordEncoder.encode(form.getPassword());
            form.setPassword(passwordHash);
        }else {
            try {
                String passwordHash = passwordEncoder.encode("123456");
                form.setPassword(passwordHash);
                mailService.sendFotgotPassworld(form.getEmail(),"123456");
            }catch (MessagingException ex){

            }
        }
        if(entity.getId()!=null){
            form.setPassword(entity.getPassword());
        }
    }


    public User findByEmailOrPhoneNumber(String username) {
        return userRepository.findByEmailOrPhoneNumber(username,username).orElse(null);
    }

    @Override
    public void delete(User entity) throws ValidateException {
        userRepository.deleteUser(entity.getId());
    }

    public User getInfomationUser() throws ValidateException {
        return SecurityUtils.getUser(userRepository);
    }

    public List<User> getListUser(Pageable pageable, Long id, String phoneNumber, String fullName, String email){
        Page<User> users = userRepository.getUser(id,phoneNumber, fullName, email,pageable);
        return users.getContent();
    }

    @Override
    public DataTableResults<User> getDataTables(UserForm form) {
        return userRepository.getDatatables(filterData, form);
    }

    public List<User> getAllCustomer(UserForm userForm) {
        return userRepository.getAllCustomer(filterData, userForm);
    }
}
