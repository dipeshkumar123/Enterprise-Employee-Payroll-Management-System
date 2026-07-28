package com.payroll.employee.repository;

import com.payroll.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByAuthUsername(String authUsername);

    List<Employee> findByNameContainingIgnoreCaseAndDepartmentContainingIgnoreCase(String name, String department);
    
    List<Employee> findByNameContainingIgnoreCase(String name);
    
    List<Employee> findByDepartmentContainingIgnoreCase(String department);
}
