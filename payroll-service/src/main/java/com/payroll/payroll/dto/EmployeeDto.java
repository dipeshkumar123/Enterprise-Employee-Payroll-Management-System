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
public class EmployeeDto {
    private Long employeeId;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private String status;
    private BigDecimal baseSalary;
}