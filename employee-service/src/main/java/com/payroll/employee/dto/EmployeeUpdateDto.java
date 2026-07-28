package com.payroll.employee.dto;

import jakarta.validation.constraints.Email;
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
public class EmployeeUpdateDto {

    // All fields are optional for partial updates
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    private String department;

    private String designation;

    private LocalDate joiningDate;

    private String status;

    private BigDecimal baseSalary;
}
