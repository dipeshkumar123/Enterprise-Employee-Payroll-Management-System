package com.payroll.payroll.service;

import com.payroll.payroll.dto.PayrollDto;
import com.payroll.payroll.dto.PayslipDto;

import java.util.List;

public interface PayrollService {

    PayrollDto generatePayroll(Long employeeId, Integer month, Integer year);

    List<PayrollDto> getPayrollHistory(Long employeeId);

    PayslipDto getPayslip(Long employeeId, Integer month, Integer year);
}