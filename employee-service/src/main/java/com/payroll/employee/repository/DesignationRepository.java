package com.payroll.employee.repository;

import com.payroll.employee.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationRepository extends JpaRepository<Designation, Long> {}
