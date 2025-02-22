package com.djeno.backend.services;

import com.djeno.backend.models.DTO.UserDetailsUpdate;
import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;


    /**
     * Вспомогательный метод для проверки строки на пустоту или null
     *
     * @param str строка для проверки
     * @return true, если строка null или пуста
     */
    private boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * Метод изменяет пользовательские данные такие как:
     * name, middleName, surname, description
     * @param userDetailsUpdate
     * @return
     */
    public User updateUserDetails(UserDetailsUpdate userDetailsUpdate) {
        User currentUser = getCurrentUser();

        currentUser.setName(isEmpty(userDetailsUpdate.getName()) ? null : userDetailsUpdate.getName());
        currentUser.setSurname(isEmpty(userDetailsUpdate.getSurname()) ? null : userDetailsUpdate.getSurname());
        currentUser.setMiddleName(isEmpty(userDetailsUpdate.getMiddleName()) ? null : userDetailsUpdate.getMiddleName());
        currentUser.setDescription(isEmpty(userDetailsUpdate.getDescription()) ? null : userDetailsUpdate.getDescription());

        return save(currentUser);
    }

    /**
     * Метод для проверки существования пользователя с данным username
     * @param username
     * @return true - пользователь существует, false - не существует
     */
    public boolean isUsernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Метод для проверки существования пользователя с данным email
     * @param email
     * @return true - пользователь существует, false - не существует
     */
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Сохранение пользователя
     *
     * @return сохраненный пользователь
     */
    public User save(User user) {
        return userRepository.save(user);
    }

    /**
     * Создание пользователя
     *
     * @return созданный пользователь
     */
    public User create(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            // Заменить на свои исключения
            throw new RuntimeException("Пользователь с таким именем уже существует");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Пользователь с таким email уже существует");
        }

        return save(user);
    }

    /**
     * Получение пользователя по username пользователя
     *
     * @return пользователь
     */
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }

    /**
     * Получение пользователя по email пользователя
     *
     * @return пользователь
     */
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }

    /**
     * Получение пользователя по username или email пользователя
     *
     * @return пользователь
     */
    public User getByUsernameOrEmail(String identifier) {
        return userRepository.findByUsername(identifier)
                .orElseGet(() -> userRepository.findByEmail(identifier)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден")));
    }

    /**
     * Получение пользователя по имени пользователя
     * <p>
     * Нужен для Spring Security
     *
     * @return пользователь
     */
    public UserDetailsService userDetailsService() {
        return this::getByUsernameOrEmail;
    }

    /**
     * Получение текущего пользователя
     *
     * @return текущий пользователь
     */
    public User getCurrentUser() {
        // Получение имени пользователя из контекста Spring Security
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        return getByUsername(username);
    }


    /**
     * Выдача прав администратора текущему пользователю
     * <p>
     * Нужен для демонстрации
     */
    @Deprecated
    public void getAdmin() {
        var user = getCurrentUser();
        user.setRole(Role.ROLE_ADMIN);
        save(user);
    }
}
