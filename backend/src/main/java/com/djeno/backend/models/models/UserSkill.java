package com.djeno.backend.models.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_skills")
public class UserSkill {

    @EmbeddedId
    private UserSkillId id;

    @ManyToOne
    @MapsId("userId") // Используем имя поля из UserSkillId
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("skillId") // Используем имя поля из UserSkillId
    @JoinColumn(name = "skill_id")
    private Skill skill;

    // Метод для удобного создания UserSkill
    public static UserSkill create(User user, Skill skill) {
        UserSkill userSkill = new UserSkill();
        userSkill.setId(new UserSkillId(user.getId(), skill.getId()));
        userSkill.setUser(user);
        userSkill.setSkill(skill);
        return userSkill;
    }
}
