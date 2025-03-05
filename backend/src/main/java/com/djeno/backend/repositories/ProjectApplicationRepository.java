package com.djeno.backend.repositories;

import com.djeno.backend.models.models.ProjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {

    List<ProjectApplication> findByProjectId(Long projectId);
}
