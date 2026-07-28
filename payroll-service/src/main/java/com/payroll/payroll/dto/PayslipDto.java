package com.payroll.payroll.dto;

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
public class PayslipDto {
    private Long payrollId;
    private Long employeeId;
    private String employeeName;
    private String department;
    private String designation;
    private Integer month;
    private Integer year;
    private BigDecimal basicPay;
    private BigDecimal hra;
    private BigDecimal conveyance;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal absentDaysDeduction;
    private BigDecimal netPay;
    private int totalWorkingDays;
    private int presentDays;
    private int absentDays;
    private int leaveDays;
    private LocalDate generatedDate;
}