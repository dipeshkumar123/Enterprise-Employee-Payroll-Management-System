package com.payroll.employee.service;

import com.payroll.employee.dto.EmployeeDto;
import com.payroll.employee.dto.EmployeeRequestDto;
import com.payroll.employee.dto.EmployeeUpdateDto;
import com.payroll.employee.entity.Employee;
import com.payroll.employee.exception.DuplicateResourceException;
import com.payroll.employee.exception.ResourceNotFoundException;
import com.payroll.employee.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger log = LoggerFactory.getLogger(EmployeeServiceImpl.class);
    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public EmployeeDto createEmployee(EmployeeRequestDto request) {
        log.info("Creating employee with email: {}", request.getEmail());
        if (employeeRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Employee with email " + request.getEmail() + " already exists");
        }

        Employee employee = new Employee();
        mapRequestToEntity(request, employee);
        Employee savedEmployee = employeeRepository.save(employee);
        log.info("Employee created with id: {}", savedEmployee.getEmployeeId());
        return mapEntityToDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(Long id) {
        log.debug("Fetching employee with id: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapEntityToDto(employee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDto> searchEmployees(String name, String department) {
        List<Employee> employees;
        if (name != null && department != null) {
            employees = employeeRepository.findByNameContainingIgnoreCaseAndDepartmentContainingIgnoreCase(name, department);
        } else if (name != null) {
            employees = employeeRepository.findByNameContainingIgnoreCase(name);
        } else if (department != null) {
            employees = employeeRepository.findByDepartmentContainingIgnoreCase(department);
        } else {
            employees = employeeRepository.findAll();
        }
        
        return employees.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDto updateEmployee(Long id, EmployeeUpdateDto request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        // Only validate and update email if it is provided
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            employeeRepository.findByEmail(request.getEmail()).ifPresent(existingEmployee -> {
                if (!existingEmployee.getEmployeeId().equals(id)) {
                    throw new DuplicateResourceException("Employee with email " + request.getEmail() + " already exists");
                }
            });
            employee.setEmail(request.getEmail());
        }

        // Apply only the non-null fields from the request
        if (request.getName() != null)        employee.setName(request.getName());
        if (request.getPhone() != null)       employee.setPhone(request.getPhone());
        if (request.getDepartment() != null)  employee.setDepartment(request.getDepartment());
        if (request.getDesignation() != null) employee.setDesignation(request.getDesignation());
        if (request.getJoiningDate() != null) employee.setJoiningDate(request.getJoiningDate());
        if (request.getStatus() != null)      employee.setStatus(request.getStatus());
        if (request.getBaseSalary() != null)  employee.setBaseSalary(request.getBaseSalary());

        Employee updatedEmployee = employeeRepository.save(employee);
        return mapEntityToDto(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    @Override
    public EmployeeDto getEmployeeByUsername(String username) {
        return employeeRepository.findByAuthUsername(username)
                .map(this::mapEntityToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user: " + username));
    }

    @Override
    public EmployeeDto provisionEmployee(Employee employee) {
        return employeeRepository.findByAuthUsername(employee.getAuthUsername())
                .map(this::mapEntityToDto)
                .orElseGet(() -> mapEntityToDto(employeeRepository.save(employee)));
    }

    private void mapRequestToEntity(EmployeeRequestDto request, Employee employee) {
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setJoiningDate(request.getJoiningDate());
        employee.setStatus(request.getStatus());
        employee.setBaseSalary(request.getBaseSalary());
    }

    private EmployeeDto mapEntityToDto(Employee employee) {
        return new EmployeeDto(
                employee.getEmployeeId(),
                employee.getName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getDepartment(),
                employee.getDesignation(),
                employee.getJoiningDate(),
                employee.getStatus(),
                employee.getBaseSalary()
        );
    }
}
