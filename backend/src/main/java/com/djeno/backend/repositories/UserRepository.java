package com.djeno.backend.repositories;

import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // Статистика для админов
    long countByRole(Role role);
    long countByIsBanned(boolean isBanned);

    // Поиск пользователей по списку ролей с пагинацией и сортировкой
    Page<User> findByRoleIn(List<Role> roles, Pageable pageable);
}
