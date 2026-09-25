package ru.example.deposit.controller;

import jakarta.validation.Valid;
import ru.example.deposit.dto.CalculationRequest;
import ru.example.deposit.dto.CalculationResponse;
import ru.example.deposit.service.DepositService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CalculationController {
    private final DepositService service;

    public CalculationController(DepositService service) {
        this.service = service;
    }

    @PostMapping("/calculate")
    public CalculationResponse calculate(@Valid @RequestBody CalculationRequest request) {
        return service.calculate(request);
    }
}
