package com.portal.core.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter  {

	@Bean
	public BCryptPasswordEncoder encoder() {
		return new BCryptPasswordEncoder();
	}

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private JwtAuthenticationEntryPoint unauthorizedHandler;

	@Override
	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {

		auth.userDetailsService(userDetailsService).passwordEncoder(encoder());

	}

	@Bean
	public AccessDeniedHandler accessDeniedHandler(){
		return new CustomAccessDeniedHandler();
	}

	@Bean
	public JwtAuthenticationFilter authenticationTokenFilterBean() {
		return new JwtAuthenticationFilter();
	}

	private static final String[] AUTH_WHITELIST = {
			"/swagger-resources/**",
			"/swagger-ui.html",
			"/v2/api-docs",
			"/webjars/**",
			"/api/v1/product",
			"/api/v1/cart",
			"/api/v1/product-details",
			"/api/v1/address"
	};

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers(AUTH_WHITELIST);
	}

	@Bean
	public AuthenticationEntryPoint authenticationEntryPoint(){
		return new CustomAuthenticationEntryPoint();
	}

	@Bean
	public CorsFilter corsFilter() {
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		final CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.setAllowedOriginPatterns(Collections.singletonList("*"));
		config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept","*"));
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
		config.setAllowedHeaders(Arrays.asList("Access-Control-Allow-Origin", "*"));
		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
	@Override
	protected void configure(HttpSecurity http) throws Exception {
    	 http
				 .sessionManagement()
				 .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				 .and()
				 .cors().and().csrf().disable()
				 .authorizeRequests()
//				 .cors().and().csrf().disable().
//				 authorizeRequests()
//				 exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
//         .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
         .antMatchers("/api/login").permitAll()   
//				 .antMatchers("/**").permitAll()
				 .antMatchers("/api/user/forgot-password",
						 "/api/user/check-code",
						 "/api/user/reset-password").permitAll()
				 .antMatchers("/api/auth/**").permitAll()
				 .antMatchers("/webjars/**").permitAll()
				 .antMatchers("/swagger-resources/**").permitAll()
				 .antMatchers("/v2/api-docs").permitAll()
				 .antMatchers("/swagger-ui.html").permitAll()
				 .antMatchers("/api/file-storage/**").permitAll()
				 .antMatchers("/api/v1/product/**").permitAll()
//				 .antMatchers("/api/v1/cart/**").permitAll()
				 .antMatchers("/api/v1/product-details/**").permitAll()
//				 .antMatchers("/api/v1/address/**").permitAll()
				 .antMatchers("/api/v1/category/**").permitAll()
				 .antMatchers("/api/v1/size/**").permitAll()
				 .antMatchers("/api/v1/color/**").permitAll()
//				 .antMatchers("/api/v1/user/**").permitAll()
         .anyRequest().authenticated().and().exceptionHandling().authenticationEntryPoint(authenticationEntryPoint()).accessDeniedHandler(accessDeniedHandler());
		 http.addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
	}
}