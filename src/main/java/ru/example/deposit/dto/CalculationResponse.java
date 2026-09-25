package ru.example.deposit.dto;

import java.math.BigDecimal;

public record CalculationResponse(BigDecimal total, BigDecimal profit) {
}
