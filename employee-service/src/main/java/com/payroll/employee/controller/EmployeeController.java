package com.payroll.employee.controller;

import com.payroll.employee.dto.EmployeeDto;
import com.payroll.employee.dto.EmployeeRequestDto;
import com.payroll.employee.dto.EmployeeUpdateDto;
import com.payroll.employee.service.EmployeeService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private static final Logger log = LoggerFactory.getLogger(EmployeeController.class);
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeRequestDto request) {
        log.info("REST request to create employee: {}", request.getEmail());
        EmployeeDto createdEmployee = employeeService.createEmployee(request);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        log.debug("REST request to get employee by id: {}", id);
        EmployeeDto employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/by-username/{username}")
    public ResponseEntity<EmployeeDto> getEmployeeByUsername(@PathVariable String username) {
        return ResponseEntity.ok(employeeService.getEmployeeByUsername(username));
    }

    @PostMapping("/provision")
    public ResponseEntity<EmployeeDto> provisionEmployee(@RequestBody com.payroll.employee.entity.Employee employee) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.provisionEmployee(employee));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String department) {
        log.debug("REST request to search employees with name: {}, department: {}", name, department);
        List<EmployeeDto> employees = employeeService.searchEmployees(name, department);
        return ResponseEntity.ok(employees);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateDto request) {
        log.info("REST request to update employee with id: {}", id);
        EmployeeDto updatedEmployee = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        log.info("REST request to delete employee with id: {}", id);
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
