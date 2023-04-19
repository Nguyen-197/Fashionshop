package com.portal.core.module.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class MailService {

    @Autowired
    public JavaMailSender emailSender;


    public String sendFotgotPassworld(String email,String password) throws MessagingException {

        MimeMessage message = emailSender.createMimeMessage();

        boolean multipart = true;

        MimeMessageHelper helper = new MimeMessageHelper(message, multipart, "utf-8");
        String htmlMsg = "<h1>Chào mừng bạn đến với hệ thống website bán quần áo thời trang yuno.Zx</h1></Br>" +
                "<h3>Tài khoản của bạn là:</h3>" + email +"</br>"+
                "<h3>Mật khẩu của bạn là :</h3>" + password;

        message.setContent(htmlMsg, "text/html; charset=UTF-8");

        helper.setTo(email);

        helper.setSubject("WELCOME TO yuno.XZ");


        this.emailSender.send(message);

        return "Email Sent!";
    }

    @Deprecated
    @Async("threadPoolTaskExecutor")
    public void sendHtmlMessage(String to, String subject, String content) throws MessagingException {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setFrom("team64datn@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);

        emailSender.send(mimeMessage);
    }
}
