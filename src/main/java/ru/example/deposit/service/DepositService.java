package ru.example.deposit.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;
import ru.example.deposit.dto.CalculationRequest;
import ru.example.deposit.dto.CalculationResponse;

@Service
public class DepositService {
    private static final MathContext PRECISION = new MathContext(34, RoundingMode.HALF_UP);
    private static final BigDecimal PERCENT_PER_YEAR = new BigDecimal("1200");

    public CalculationResponse calculate(CalculationRequest request) {
        BigDecimal monthlyRate = request.rate().divide(PERCENT_PER_YEAR, PRECISION);
        BigDecimal factor = BigDecimal.ONE.add(monthlyRate).pow(request.months(), PRECISION);
        BigDecimal total = request.amount().multiply(factor, PRECISION).setScale(2, RoundingMode.HALF_UP);
        BigDecimal profit = total.subtract(request.amount()).setScale(2, RoundingMode.HALF_UP);
        return new CalculationResponse(total, profit);
    }
}
