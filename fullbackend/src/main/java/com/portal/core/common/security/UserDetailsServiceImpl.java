package com.portal.core.common.security;

import com.portal.core.module.entities.Role;
import com.portal.core.module.entities.User;
import com.portal.core.module.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service("userDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrOPhoneNumber) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findByEmailAndActive(emailOrOPhoneNumber, true);
        if (!optionalUser.isEmpty()) {
            User user = optionalUser.get();
//            List<Role> roles = user.getRoles();
            List<GrantedAuthority> grantedAuthorities = new ArrayList<>();

//            for (Role role : roles) {
                grantedAuthorities.add(new SimpleGrantedAuthority(user.getRole().getName()));
//            }
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), grantedAuthorities);
        } else {
            User user = userRepository.findByPhoneNumberAndActive(emailOrOPhoneNumber, true);
            if(user== null){

                throw new UsernameNotFoundException("User not found with phonenumber: "+ emailOrOPhoneNumber);

            }
//            List<Role> roles = user.getRoles();
            List<GrantedAuthority> grantedAuthorities = new ArrayList<>();

//            for (Role role : roles) {
                grantedAuthorities.add(new SimpleGrantedAuthority(user.getRole().getName()));
                return new org.springframework.security.core.userdetails.User(user.getPhoneNumber(), user.getPassword(), grantedAuthorities);

        }

    }

}
