package com.djeno.backend.models.mappers;

import com.djeno.backend.models.DTO.UserListDTO;
import com.djeno.backend.models.models.User;

public class UserListMapper {
    /**
     * Метод преобразовывает объект User в UserListDTO для вывода списков пользователей с ограниченным набором данных
     * @param user
     * @return
     */
    public static UserListDTO toDTO(User user) {
        return UserListDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .surname(user.getSurname())
                .middleName(user.getMiddleName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .rating(user.getRating())
                .isBanned(user.getIsBanned())
                .banReason(user.getBanReason())
                .build();
    }
}
