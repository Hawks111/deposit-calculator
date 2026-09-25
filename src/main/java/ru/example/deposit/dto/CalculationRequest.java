package ru.example.deposit.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CalculationRequest(
        @NotNull @DecimalMin("1000") @DecimalMax("10000000") BigDecimal amount,
        @NotNull @Min(1) @Max(60) Integer months,
        @NotNull @DecimalMin("1") @DecimalMax("20") BigDecimal rate) {
}
