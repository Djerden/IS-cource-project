package com.djeno.backend.repositories.specification;

import com.djeno.backend.models.enums.Role;
import com.djeno.backend.models.models.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UserSpecifications {

    public static Specification<User> withUsernameLike(String username) {
        return (root, query, criteriaBuilder) -> {
            if (username == null || username.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(root.get("username"), "%" + username + "%");
        };
    }

    public static Specification<User> withEmailLike(String email) {
        return (root, query, criteriaBuilder) -> {
            if (email == null || email.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(root.get("email"), "%" + email + "%");
        };
    }

    public static Specification<User> withRoles(List<Role> roles) {
        return (root, query, criteriaBuilder) -> {
            if (roles == null || roles.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return root.get("role").in(roles);
        };
    }

    public static Specification<User> withFilters(String username, String email, List<Role> roles, Boolean isBanned) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (username != null && !username.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("username"), "%" + username + "%"));
            }

            if (email != null && !email.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("email"), "%" + email + "%"));
            }

            if (roles != null && !roles.isEmpty()) {
                predicates.add(root.get("role").in(roles));
            }

            if (isBanned != null) {
                predicates.add(criteriaBuilder.equal(root.get("isBanned"), isBanned));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
