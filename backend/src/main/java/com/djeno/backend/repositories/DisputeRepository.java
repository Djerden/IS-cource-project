package com.djeno.backend.repositories;

import com.djeno.backend.models.enums.DisputeStatus;
import com.djeno.backend.models.models.Dispute;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    Optional<Dispute> findByProjectId(Long projectId);

    List<Dispute> findAllByProjectId(Long projectId);

    Page<Dispute> findAllByAdminIsNull(Pageable pageable); // Пагинированный запрос для споров без админа

    List<Dispute> findAllByProjectIdAndStatus(Long projectId, DisputeStatus status);

}
