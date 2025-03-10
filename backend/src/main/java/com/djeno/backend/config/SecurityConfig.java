package com.djeno.backend.config;

import com.djeno.backend.security.JwtAuthenticationFilter;
import com.djeno.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                // отключение CORS (разрешение запросов со всех доменов)
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOriginPatterns(List.of("*"));
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                // Настройка доступа к конечным точкам
                .authorizeHttpRequests(request -> request

                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-resources/*", "/v3/api-docs/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/auth/send-email-verification-code").authenticated()
                        .requestMatchers(HttpMethod.POST, "/auth/verify-email").authenticated()

                        .requestMatchers("/info/user/**").permitAll()
                        .requestMatchers("/user/freelancers").permitAll()
                        .requestMatchers("/user/**").authenticated()
                        .requestMatchers("/info/**").authenticated()
                        .requestMatchers("/dispute/**").authenticated()
                        .requestMatchers("/project-files/**").authenticated()
                        .requestMatchers("/admin/statistics").permitAll()
                        .requestMatchers("/admin/admins").permitAll()
                        .requestMatchers("/admin/regular-users").permitAll()
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN", "MAIN_ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/admin/grant-admin/**", "/admin/revoke-admin/**", "/admin/grant-main-admin/**").hasRole("MAIN_ADMIN")


                        .requestMatchers("/help/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/help/articles").hasAnyRole("ADMIN", "MAIN_ADMIN")
                        .requestMatchers("/category/**").permitAll()
                        .requestMatchers("/project/**").permitAll()
                        .requestMatchers("/project/user/**").permitAll()
                        .requestMatchers("/project-application").authenticated()

                        .requestMatchers("/blog/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/blog/article").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/blog/articles/**").permitAll()//.hasAnyRole("ADMIN", "MAIN_ADMIN")

                        .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService.userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
