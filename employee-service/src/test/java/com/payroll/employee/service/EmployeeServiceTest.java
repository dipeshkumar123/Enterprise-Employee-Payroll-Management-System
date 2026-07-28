package com.payroll.employee.service;

import com.payroll.employee.dto.EmployeeRequestDto;
import com.payroll.employee.dto.EmployeeUpdateDto;
import com.payroll.employee.dto.EmployeeDto;
import com.payroll.employee.entity.Employee;
import com.payroll.employee.exception.DuplicateResourceException;
import com.payroll.employee.exception.ResourceNotFoundException;
import com.payroll.employee.repository.EmployeeRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private EmployeeRequestDto requestDto;
    private Employee employee;

    @BeforeEach
    void setUp() {
        requestDto = new EmployeeRequestDto();
        requestDto.setName("John Doe");
        requestDto.setEmail("john@example.com");
        requestDto.setPhone("1234567890");
        requestDto.setDepartment("Engineering");
        requestDto.setDesignation("Software Engineer");
        requestDto.setJoiningDate(LocalDate.of(2024, 1, 1));
        requestDto.setStatus("ACTIVE");
        requestDto.setBaseSalary(new BigDecimal("50000"));

        employee = new Employee();
        employee.setEmployeeId(1L);
        employee.setName(requestDto.getName());
        employee.setEmail(requestDto.getEmail());
        employee.setDepartment(requestDto.getDepartment());
    }

    @Test
    void createEmployee_Success() {
        when(employeeRepository.findByEmail(requestDto.getEmail())).thenReturn(Optional.empty());
        when(employeeRepository.save(any(Employee.class))).thenReturn(employee);

        EmployeeDto result = employeeService.createEmployee(requestDto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1L, result.getEmployeeId());
        Assertions.assertEquals("john@example.com", result.getEmail());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void createEmployee_DuplicateEmail_ThrowsException() {
        when(employeeRepository.findByEmail(requestDto.getEmail())).thenReturn(Optional.of(employee));

        Assertions.assertThrows(DuplicateResourceException.class, () -> employeeService.createEmployee(requestDto));
    }

    @Test
    void getEmployeeById_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        EmployeeDto result = employeeService.getEmployeeById(1L);

        Assertions.assertNotNull(result);
        Assertions.assertEquals("John Doe", result.getName());
    }

    @Test
    void getEmployeeById_NotFound_ThrowsException() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class, () -> employeeService.getEmployeeById(1L));
    }

    @Test
    void searchEmployees_ByName_ReturnsList() {
        when(employeeRepository.findByNameContainingIgnoreCase("John")).thenReturn(List.of(employee));

        List<EmployeeDto> results = employeeService.searchEmployees("John", null);

        Assertions.assertFalse(results.isEmpty());
        Assertions.assertEquals(1, results.size());
    }

    @Test
    void updateEmployee_Success() {
        EmployeeUpdateDto updateDto = new EmployeeUpdateDto();
        updateDto.setName("Jane Doe");
        updateDto.setEmail("john@example.com");
        updateDto.setDepartment("Engineering");

        Employee updated = new Employee();
        updated.setEmployeeId(1L);
        updated.setName("Jane Doe");
        updated.setEmail("john@example.com");
        updated.setDepartment("Engineering");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(updated);

        EmployeeDto result = employeeService.updateEmployee(1L, updateDto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals("Jane Doe", result.getName());
    }

    @Test
    void deleteEmployee_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        doNothing().when(employeeRepository).delete(employee);

        Assertions.assertDoesNotThrow(() -> employeeService.deleteEmployee(1L));
        verify(employeeRepository, times(1)).delete(employee);
    }
}