package com.djeno.backend.models.DTO.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDetailsUpdate {
    private String name;
    private String surname;
    private String middleName;
    private String description;
}
