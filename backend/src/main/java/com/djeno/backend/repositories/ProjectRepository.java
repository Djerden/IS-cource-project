package com.djeno.backend.repositories;

import com.djeno.backend.models.enums.ProjectStatus;
import com.djeno.backend.models.models.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {

    /**
     * Метод для поиска проектов по ID владельца или ID фрилансера с пагинацией и сортировкой
     *
     * @param ownerId      ID владельца
     * @param freelancerId ID фрилансера
     * @param pageable     объект пагинации и сортировки
     * @return Страница проектов
     */
    @Query("SELECT p FROM Project p " +
            "WHERE (p.owner.id = :ownerId OR (p.freelancer IS NOT NULL AND p.freelancer.id = :freelancerId)) " +
            "ORDER BY p.createdAt DESC")
    Page<Project> findByOwnerIdOrFreelancerId(
            @Param("ownerId") Long ownerId,
            @Param("freelancerId") Long freelancerId,
            Pageable pageable
    );

    // Статистика для админов
    long countByStatus(ProjectStatus status);
    long countByFreelancerIsNull();
}
