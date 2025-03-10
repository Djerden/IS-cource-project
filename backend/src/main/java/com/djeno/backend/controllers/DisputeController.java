package com.djeno.backend.controllers;

import com.djeno.backend.models.DTO.SimpleMessage;
import com.djeno.backend.models.DTO.dispute.CreateDisputeRequest;
import com.djeno.backend.models.DTO.dispute.DisputeDTO;
import com.djeno.backend.models.DTO.dispute.ResolveDisputeRequest;
import com.djeno.backend.services.DisputeService;
import com.djeno.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/dispute")
@RestController
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping("/resolve")
    public ResponseEntity<DisputeDTO> resolveDispute(@RequestBody ResolveDisputeRequest request) {
        DisputeDTO disputeDTO = disputeService.resolveDispute(request);
        return ResponseEntity.ok(disputeDTO);
    }

    // Метод для создания спора
    @PostMapping("/create")
    public ResponseEntity<SimpleMessage> createDispute(@RequestBody CreateDisputeRequest request) {
        DisputeDTO disputeDTO = disputeService.createDispute(request.getProjectId(), request.getComment());
        return ResponseEntity.ok(new SimpleMessage("Dispute создан"));
    }

    // Метод для получения всех споров по ID проекта
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<DisputeDTO>> getDisputesByProjectId(@PathVariable Long projectId) {
        List<DisputeDTO> disputes = disputeService.getDisputesByProjectId(projectId);

        return ResponseEntity.ok(disputes);
    }

    // Метод для назначения админа на спор
    @PostMapping("/{disputeId}/assign-admin")
    public ResponseEntity<DisputeDTO> assignAdminToDispute(@PathVariable Long disputeId) {
        DisputeDTO disputeDTO = disputeService.assignAdminToDispute(disputeId);

        return ResponseEntity.ok(disputeDTO);
    }

    // Метод для получения всех споров без назначенного админа
    @GetMapping("/without-admin")
    public ResponseEntity<Page<DisputeDTO>> getDisputesWithoutAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));

        Page<DisputeDTO> disputes = disputeService.getDisputesWithoutAdmin(pageable);

        return ResponseEntity.ok(disputes);
    }
}
