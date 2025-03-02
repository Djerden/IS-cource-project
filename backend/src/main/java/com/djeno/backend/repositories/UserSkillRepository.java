package com.djeno.backend.repositories;

import com.djeno.backend.models.models.Skill;
import com.djeno.backend.models.models.User;
import com.djeno.backend.models.models.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    Optional<UserSkill> findByUserAndSkill(User user, Skill skill);
    void deleteByUserAndSkill(User user, Skill skill);
}
