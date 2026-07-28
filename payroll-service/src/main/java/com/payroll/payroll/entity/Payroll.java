package com.payroll.payroll.entity;

import com.payroll.payroll.enums.PayrollStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payroll",
       uniqueConstraints = @UniqueConstraint(
           name = "uk_employee_month_year",
           columnNames = {"employee_id", "month", "year"}
       ))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payrollId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basicPay;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal hra;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal conveyance;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal allowances;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal deductions;

    @Column(name = "absent_days_deduction", precision = 10, scale = 2)
    private BigDecimal absentDaysDeduction;

    @Column(name = "net_pay", nullable = false, precision = 10, scale = 2)
    private BigDecimal netPay;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayrollStatus status;

    @Column(name = "generated_date")
    private LocalDate generatedDate;
}