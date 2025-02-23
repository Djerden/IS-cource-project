package com.djeno.backend.models.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BanInfo {
    private Long userId;
    private String banReason;
}
