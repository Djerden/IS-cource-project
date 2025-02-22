package com.djeno.backend.models.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_skills")
public class UserSkill {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "skill_id")
    private Skill skill;
}
