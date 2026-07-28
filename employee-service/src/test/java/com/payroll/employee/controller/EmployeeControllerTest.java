package com.payroll.employee.controller;

import com.payroll.employee.dto.EmployeeDto;
import com.payroll.employee.dto.EmployeeRequestDto;
import com.payroll.employee.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService employeeService;

    @Test
    void createEmployee_ReturnsCreated() throws Exception {
        EmployeeDto dto = new EmployeeDto(1L, "John Doe", "john@example.com", "1234567890",
                "Engineering", "Software Engineer", LocalDate.of(2024, 1, 1), "ACTIVE", new BigDecimal("50000"));

        when(employeeService.createEmployee(any(EmployeeRequestDto.class))).thenReturn(dto);

        mockMvc.perform(post("/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"department\":\"Engineering\",\"designation\":\"Software Engineer\",\"joiningDate\":\"2024-01-01\",\"status\":\"ACTIVE\",\"baseSalary\":50000}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"));
    }

    @Test
    void getEmployeeById_ReturnsEmployee() throws Exception {
        EmployeeDto dto = new EmployeeDto(1L, "John Doe", "john@example.com", "1234567890",
                "Engineering", "Software Engineer", LocalDate.of(2024, 1, 1), "ACTIVE", new BigDecimal("50000"));

        when(employeeService.getEmployeeById(1L)).thenReturn(dto);

        mockMvc.perform(get("/employees/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void searchEmployees_ReturnsList() throws Exception {
        EmployeeDto dto = new EmployeeDto(1L, "John Doe", "john@example.com", "1234567890",
                "Engineering", "Software Engineer", LocalDate.of(2024, 1, 1), "ACTIVE", new BigDecimal("50000"));

        when(employeeService.searchEmployees("John", null)).thenReturn(List.of(dto));

        mockMvc.perform(get("/employees?name=John"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("John Doe"));
    }
}