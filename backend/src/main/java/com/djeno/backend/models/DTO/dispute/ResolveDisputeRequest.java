package com.djeno.backend.models.DTO.dispute;

import com.djeno.backend.models.enums.DisputeResolution;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResolveDisputeRequest {
    private Long disputeId;
    private DisputeResolution resolution;
    private String message;
}

