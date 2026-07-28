package com.payroll.employee.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "designations")
@Data
public class Designation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String title;
    private String level;
    @Column(length = 1000)
    private String description;
}
