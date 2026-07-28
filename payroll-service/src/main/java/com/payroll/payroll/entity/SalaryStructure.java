package com.payroll.payroll.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "salary_structure")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String grade;

    @Column(name = "basic_pay", nullable = false, precision = 10, scale = 2)
    private BigDecimal basicPay;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal hra;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal conveyance;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal bonus;

    @Column(name = "per_day_deduction", nullable = false, precision = 10, scale = 2)
    private BigDecimal perDayDeduction;
}