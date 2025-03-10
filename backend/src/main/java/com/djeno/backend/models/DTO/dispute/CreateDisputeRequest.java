package com.djeno.backend.models.DTO.dispute;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDisputeRequest {
    private Long projectId;
    private String comment;
}
