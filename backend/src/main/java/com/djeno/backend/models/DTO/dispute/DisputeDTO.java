package com.djeno.backend.models.DTO.dispute;

import com.djeno.backend.models.enums.DisputeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisputeDTO {
    private Long id;
    private Long projectId;
    private String initiatorUsername;
    private DisputeStatus status;
    private String comment;
    private LocalDateTime createdAt;
    private String adminUsername;
    private String resolution;
    private LocalDateTime resolvedAt;
}
