package com.djeno.backend.repositories.specification;

import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

    public static Specification<User> hasRole(Role role) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("role"), role);
    }

    public static Specification<User> hasIsBannedTrue() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("isBanned"), true);
    }

    public static Specification<User> hasUsernameLike(String username) {
        if (username == null || username.isEmpty()) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("username"), "%" + username + "%");
    }

    public static Specification<User> hasEmailLike(String email) {
        if (email == null || email.isEmpty()) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(root.get("email"), "%" + email + "%");
    }
}
