package ru.example.deposit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import ru.example.deposit.dto.CalculationRequest;
import ru.example.deposit.dto.CalculationResponse;

class DepositServiceTest {
    private final DepositService service = new DepositService();

    @Test
    void calculatesMonthlyCompoundingAndRoundsToKopecks() {
        CalculationResponse response = service.calculate(new CalculationRequest(
                new BigDecimal("100000"), 12, new BigDecimal("8.5")));
        assertEquals(new BigDecimal("108839.09"), response.total());
        assertEquals(new BigDecimal("8839.09"), response.profit());
    }

    @Test
    void handlesBoundaryWithOneMonth() {
        CalculationResponse response = service.calculate(new CalculationRequest(
                new BigDecimal("1000"), 1, new BigDecimal("1")));
        assertEquals(new BigDecimal("1000.83"), response.total());
        assertEquals(new BigDecimal("0.83"), response.profit());
    }
}
