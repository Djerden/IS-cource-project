package com.djeno.backend.models.DTO.help;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HelpArticleForListDTO {
    private Long id;
    private String title;
    private String shortDescription;
}
