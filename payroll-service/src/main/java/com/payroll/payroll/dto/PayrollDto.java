package com.payroll.payroll.dto;

import com.payroll.payroll.enums.PayrollStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PayrollDto {
    private Long payrollId;
    private Long employeeId;
    private Integer month;
    private Integer year;
    private BigDecimal basicPay;
    private BigDecimal hra;
    private BigDecimal conveyance;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal absentDaysDeduction;
    private BigDecimal netPay;
    private PayrollStatus status;
    private LocalDate generatedDate;
}