package com.payroll.employee.service;

import com.payroll.employee.dto.EmployeeDto;
import com.payroll.employee.dto.EmployeeRequestDto;
import com.payroll.employee.dto.EmployeeUpdateDto;

import java.util.List;

public interface EmployeeService {
    EmployeeDto createEmployee(EmployeeRequestDto request);
    EmployeeDto getEmployeeById(Long id);
    List<EmployeeDto> getAllEmployees();
    List<EmployeeDto> searchEmployees(String name, String department);
    EmployeeDto updateEmployee(Long id, EmployeeUpdateDto request);
    void deleteEmployee(Long id);
    EmployeeDto getEmployeeByUsername(String username);
    EmployeeDto provisionEmployee(com.payroll.employee.entity.Employee employee);
}
