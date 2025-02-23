package com.djeno.backend.models.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryCreate {
    private String name;
    private Long parentId;
    private String parentName;
}
