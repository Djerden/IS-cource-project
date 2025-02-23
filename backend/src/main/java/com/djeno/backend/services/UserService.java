package com.djeno.backend.services;

import com.djeno.backend.models.DTO.UserDetailsUpdate;
import com.djeno.backend.models.DTO.UserListDTO;
import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.mappers.UserListMapper;
import com.djeno.backend.models.models.User;
import com.djeno.backend.repositories.UserRepository;
import com.djeno.backend.repositories.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    /**
     * Метод для выдачи бана пользователю
     *
     * @param userId ID пользователя
     * @param reason Причина бана
     * @return
     */
    public User banUser(Long userId, String reason) {
        User currentUser = getCurrentUser();

        if (!isAdminOrMainAdmin(currentUser)) {
            throw new RuntimeException("Недостаточно прав для бана пользователя");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (isAdminOrMainAdmin(user)) {
            throw new RuntimeException("Невозможно забанить пользователя с ролью ADMIN или MAIN_ADMIN");
        }

        if (user.getIsBanned()) {
            throw new RuntimeException("Пользователь уже забанен по причине: '" + user.getBanReason() + "'");
        }

        user.setIsBanned(true);
        user.setBanReason(reason);

        return userRepository.save(user);
    }

    /**
     * Метод для снятия бана у пользователя
     *
     * @param userId ID пользователя
     * @return
     */
    public User unbanUser(Long userId) {
        User currentUser = getCurrentUser();

        if (!isAdminOrMainAdmin(currentUser)) {
            throw new RuntimeException("Недостаточно прав для разбана пользователя");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!user.getIsBanned()) {
            throw new RuntimeException("Пользователь не находится в бане");
        }

        user.setIsBanned(false);
        user.setBanReason(null);

        return userRepository.save(user);
    }



    /**
     *  Метод, который возвращает список пользователей по заданным параметрам фильтрации и пагинации
     *  По умолчанию предназначен для получения списка администраторов
     *
     * @param roles
     * @param username
     * @param email
     * @param page
     * @param size
     * @param sortBy
     * @param ascending
     * @return
     */
    public Page<UserListDTO> getUsersWithFilters(List<Role> roles, String username, String email, int page, int size, String sortBy, boolean ascending) {
        Specification<User> spec = Specification.where(null);

        if (roles != null && !roles.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> root.get("role").in(roles));
        }

        spec = spec.and(UserSpecification.hasUsernameLike(username));
        spec = spec.and(UserSpecification.hasEmailLike(email));

        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<User> userPage = userRepository.findAll(spec, pageRequest);

        return userPage.map(UserListMapper::toDTO);
    }

    /**
     *  Метод, который возвращает список забанненных пользователей
     *
     * @param roles
     * @param username
     * @param email
     * @param page
     * @param size
     * @param sortBy
     * @param ascending
     * @return
     */
    public Page<UserListDTO> getBannedUsersWithFilters(List<Role> roles, String username, String email, int page, int size, String sortBy, boolean ascending) {
        Specification<User> spec = Specification.where(UserSpecification.hasIsBannedTrue());

        if (roles != null && !roles.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> root.get("role").in(roles));
        }

        spec = spec.and(UserSpecification.hasUsernameLike(username));
        spec = spec.and(UserSpecification.hasEmailLike(email));

        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<User> userPage = userRepository.findAll(spec, pageRequest);

        return userPage.map(UserListMapper::toDTO);
    }

    /**
     * Метод нужен для проверки является ли пользователем админом
     * @param user
     * @return
     */
    private boolean isAdminOrMainAdmin(User user) {
        Role userRole = user.getRole();
        return userRole == Role.ROLE_ADMIN || userRole == Role.ROLE_MAIN_ADMIN;
    }

    /**
     * Метод нужен для проверки есть ли у пользователя права главного администратора
     * @param user
     * @return
     */
    private boolean isMainAdmin(User user) {
        return user.getRole() == Role.ROLE_MAIN_ADMIN;
    }

    /**
     * Метод нужен для проверки есть ли у пользователя права обычного администратора
     * @param user
     * @return
     */
    private boolean isAdmin(User user) {
        return user.getRole() == Role.ROLE_ADMIN;
    }

    /**
     * Метод для выдачи пользователю прав обычного администратора
     * Данный функционал может использовать только пользователь с ролью ROLE_MAIN_ADMIN
     * @param userId Id пользователя, кому выдаем права
     * @return
     */
    public User grantAdminRole(Long userId) {
        User currentUser = getCurrentUser();

        if(!isMainAdmin(currentUser)) {
            throw new RuntimeException("Недостаточно прав для выдачи роли");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Если у пользователя уже есть роль ADMIN, то не меняем роль
        if (isAdmin(user)) {
            throw new RuntimeException("Пользователь уже имеет роль ADMIN");
        }

        user.setRole(Role.ROLE_ADMIN);
        return userRepository.save(user);
    }

    /**
     * Метод для снятия у пользователя прав обычного администратора
     * Данный функционал может использовать только пользователь с ролью ROLE_MAIN_ADMIN
     * @param userId Id пользователя, с кого снимаем права
     * @return
     */
    public User revokeAdminRole(Long userId) {
        User currentUser = getCurrentUser();

        // Проверяем, может ли текущий пользователь снять роль
        if (!isMainAdmin(currentUser)) {
            throw new RuntimeException("Недостаточно прав для снятия роли");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Если у пользователя нет роли ADMIN, то не меняем роль
        if (!isAdmin(user)) {
            throw new RuntimeException("Пользователь не имеет роли ADMIN");
        }

        user.setRole(Role.ROLE_CUSTOMER); // Возвращаем роль на базовую (сделать так, чтобы можно выло выбрать какую)
        return userRepository.save(user);
    }

    /**
     * Метод для выдачи пользователю прав главного администратора
     * Данный функционал может использовать только пользователь с ролью ROLE_MAIN_ADMIN
     * @param userId Id пользователя, кому выдаем права
     * @return
     */
    public User grantMainAdminRole(Long userId) {
        User currentUser = getCurrentUser();

        // Проверяем, может ли текущий пользователь выдать роль MAIN_ADMIN
        if (!isMainAdmin(currentUser)) {
            throw new RuntimeException("Недостаточно прав для выдачи роли");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Если у пользователя уже есть роль MAIN_ADMIN, то не меняем роль
        if (user.getRole() == Role.ROLE_MAIN_ADMIN) {
            throw new RuntimeException("Пользователь уже имеет роль MAIN_ADMIN");
        }

        user.setRole(Role.ROLE_MAIN_ADMIN);
        return userRepository.save(user);
    }

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
}
