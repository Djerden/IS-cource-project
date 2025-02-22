package com.djeno.backend.models.models;

import com.djeno.backend.models.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Идентификатор транзакции

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Связь с пользователем, который совершил транзакцию

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = true)
    private Project project;  // Связь с проектом, если транзакция связана с проектом

    @Column(nullable = false)
    private BigDecimal amount;  // Сумма транзакции

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;  // Тип транзакции (депозит, вывод и т.д.)

    @Column(nullable = false)
    private LocalDateTime transactionDate;  // Дата и время транзакции
}
