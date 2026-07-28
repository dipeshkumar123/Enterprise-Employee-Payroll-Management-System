package com.payroll.payroll.controller;

import com.payroll.payroll.dto.PayrollDto;
import com.payroll.payroll.dto.PayslipDto;
import com.payroll.payroll.enums.PayrollStatus;
import com.payroll.payroll.service.PayrollService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PayrollController.class)
class PayrollControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PayrollService payrollService;

    @Test
    void generatePayroll_ReturnsCreated() throws Exception {
        PayrollDto dto = new PayrollDto();
        dto.setPayrollId(1L);
        dto.setEmployeeId(1L);
        dto.setMonth(5);
        dto.setYear(2026);
        dto.setNetPay(new BigDecimal("64000"));
        dto.setStatus(PayrollStatus.COMPLETED);

        when(payrollService.generatePayroll(1L, 5, 2026)).thenReturn(dto);

        mockMvc.perform(post("/payroll/generate?employeeId=1&month=5&year=2026"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.payrollId").value(1L))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void getPayrollHistory_ReturnsList() throws Exception {
        PayrollDto dto = new PayrollDto();
        dto.setPayrollId(1L);
        dto.setEmployeeId(1L);
        dto.setMonth(5);
        dto.setYear(2026);
        dto.setNetPay(new BigDecimal("64000"));

        when(payrollService.getPayrollHistory(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/payroll/history/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].payrollId").value(1L));
    }

    @Test
    void getPayslip_ReturnsPayslip() throws Exception {
        PayslipDto payslip = new PayslipDto();
        payslip.setEmployeeId(1L);
        payslip.setEmployeeName("John Doe");
        payslip.setMonth(5);
        payslip.setYear(2026);
        payslip.setPresentDays(20);

        when(payrollService.getPayslip(1L, 5, 2026)).thenReturn(payslip);

        mockMvc.perform(get("/payroll/payslip/1?month=5&year=2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeName").value("John Doe"))
                .andExpect(jsonPath("$.presentDays").value(20));
    }
}