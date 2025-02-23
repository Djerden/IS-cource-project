package com.djeno.backend.services;

import com.djeno.backend.models.models.Skill;
import com.djeno.backend.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public Skill createSkill(String name) {

        if (skillRepository.existsByName(name)) {
            throw new RuntimeException("Навык с названием '" + name + "' уже существует");
        }
        Skill skill = new Skill();
        skill.setName(name);

        return skillRepository.save(skill);
    }
}
