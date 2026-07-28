package com.payroll.payroll.controller;

import com.payroll.payroll.dto.PayrollDto;
import com.payroll.payroll.dto.PayslipDto;
import com.payroll.payroll.service.PayrollService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PostMapping("/generate/{employeeId}")
    public ResponseEntity<PayrollDto> generatePayroll(
            @PathVariable Long employeeId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        PayrollDto payroll = payrollService.generatePayroll(employeeId, month, year);
        return new ResponseEntity<>(payroll, HttpStatus.CREATED);
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<List<PayrollDto>> getPayrollHistory(@PathVariable Long employeeId) {
        List<PayrollDto> payrolls = payrollService.getPayrollHistory(employeeId);
        return ResponseEntity.ok(payrolls);
    }

    @GetMapping("/payslip/{employeeId}/{month}/{year}")
    public ResponseEntity<PayslipDto> getPayslip(
            @PathVariable Long employeeId,
            @PathVariable Integer month,
            @PathVariable Integer year) {
        PayslipDto payslip = payrollService.getPayslip(employeeId, month, year);
        return ResponseEntity.ok(payslip);
    }
}