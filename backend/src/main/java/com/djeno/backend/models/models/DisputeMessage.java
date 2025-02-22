package com.djeno.backend.models.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "dispute_messages")
public class DisputeMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dispute_id")
    private Dispute dispute;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(nullable = false)
    private String content;

    private LocalDateTime createdAt;
}
