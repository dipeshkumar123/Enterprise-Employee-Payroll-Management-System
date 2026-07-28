package com.payroll.payroll.service;

import com.payroll.payroll.client.AttendanceClient;
import com.payroll.payroll.client.EmployeeClient;
import com.payroll.payroll.dto.*;
import com.payroll.payroll.entity.Payroll;
import com.payroll.payroll.entity.SalaryStructure;
import com.payroll.payroll.enums.PayrollStatus;
import com.payroll.payroll.exception.DuplicateResourceException;
import com.payroll.payroll.exception.InvalidPayrollDataException;
import com.payroll.payroll.exception.ResourceNotFoundException;
import com.payroll.payroll.repository.PayrollRepository;
import com.payroll.payroll.repository.SalaryStructureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final EmployeeClient employeeClient;
    private final AttendanceClient attendanceClient;

    public PayrollServiceImpl(PayrollRepository payrollRepository,
                              SalaryStructureRepository salaryStructureRepository,
                              EmployeeClient employeeClient,
                              AttendanceClient attendanceClient) {
        this.payrollRepository = payrollRepository;
        this.salaryStructureRepository = salaryStructureRepository;
        this.employeeClient = employeeClient;
        this.attendanceClient = attendanceClient;
    }

    @Override
    @Transactional
    public PayrollDto generatePayroll(Long employeeId, Integer month, Integer year) {
        // Validate date range
        if (month < 1 || month > 12) {
            throw new InvalidPayrollDataException("Month must be between 1 and 12");
        }

        // Check if payroll already exists for this employee/month/year
        Optional<Payroll> existing = payrollRepository.findByEmployeeIdAndMonthAndYear(employeeId, month, year);
        if (existing.isPresent()) {
            throw new DuplicateResourceException(
                    "Payroll already exists for employee " + employeeId + " for " + month + "/" + year);
        }

        // Fetch employee details
        EmployeeDto employee = employeeClient.getEmployeeById(employeeId);
        if (employee == null) {
            throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
        }

        // Fetch monthly attendance summary
        MonthlyAttendanceSummary attendance = attendanceClient.getMonthlyAttendance(employeeId, month, year);
        if (attendance == null) {
            throw new InvalidPayrollDataException(
                    "Attendance data not found for employee " + employeeId + " for " + month + "/" + year);
        }

        // Find salary structure based on employee's designation/grade
        String grade = deriveGrade(employee.getDesignation());
        SalaryStructure salaryStructure = salaryStructureRepository.findByGrade(grade)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Salary structure not found for grade: " + grade));

        // Calculate components
        BigDecimal basicPay = salaryStructure.getBasicPay();
        BigDecimal hra = salaryStructure.getHra();
        BigDecimal conveyance = salaryStructure.getConveyance();
        BigDecimal allowances = salaryStructure.getBonus();

        // Calculate deduction for absent days
        long absentDays = attendance.getAbsentDays();
        BigDecimal absentDaysDeduction = salaryStructure.getPerDayDeduction()
                .multiply(BigDecimal.valueOf(absentDays))
                .setScale(2, RoundingMode.HALF_UP);

        // Total deductions = absent days deduction + half-day adjustments etc.
        long halfDays = attendance.getHalfDays();
        BigDecimal halfDayDeduction = salaryStructure.getPerDayDeduction()
                .multiply(BigDecimal.valueOf(halfDays))
                .divide(BigDecimal.valueOf(2), RoundingMode.HALF_UP)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalDeductions = absentDaysDeduction.add(halfDayDeduction);

        // Net pay calculation
        BigDecimal grossPay = basicPay.add(hra).add(conveyance).add(allowances);
        BigDecimal netPay = grossPay.subtract(totalDeductions)
                .setScale(2, RoundingMode.HALF_UP);

        // Build and save payroll entity
        Payroll payroll = new Payroll();
        payroll.setEmployeeId(employeeId);
        payroll.setMonth(month);
        payroll.setYear(year);
        payroll.setBasicPay(basicPay);
        payroll.setHra(hra);
        payroll.setConveyance(conveyance);
        payroll.setAllowances(allowances);
        payroll.setDeductions(totalDeductions);
        payroll.setAbsentDaysDeduction(absentDaysDeduction);
        payroll.setNetPay(netPay);
        payroll.setStatus(PayrollStatus.COMPLETED);
        payroll.setGeneratedDate(LocalDate.now());

        Payroll saved = payrollRepository.save(payroll);
        return mapToDto(saved);
    }

    @Override
    public List<PayrollDto> getPayrollHistory(Long employeeId) {
        List<Payroll> payrolls = payrollRepository.findByEmployeeIdOrderByYearDescMonthDesc(employeeId);
        if (payrolls.isEmpty()) {
            throw new ResourceNotFoundException("No payroll records found for employee id: " + employeeId);
        }
        return payrolls.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PayslipDto getPayslip(Long employeeId, Integer month, Integer year) {
        Payroll payroll = payrollRepository.findByEmployeeIdAndMonthAndYear(employeeId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payslip not found for employee " + employeeId + " for " + month + "/" + year));

        EmployeeDto employee = employeeClient.getEmployeeById(employeeId);

        // Fetch attendance for the detailed payslip
        MonthlyAttendanceSummary attendance = attendanceClient.getMonthlyAttendance(employeeId, month, year);

        PayslipDto payslip = new PayslipDto();
        payslip.setPayrollId(payroll.getPayrollId());
        payslip.setEmployeeId(payroll.getEmployeeId());
        payslip.setEmployeeName(employee != null ? employee.getName() : "N/A");
        payslip.setDepartment(employee != null ? employee.getDepartment() : "N/A");
        payslip.setDesignation(employee != null ? employee.getDesignation() : "N/A");
        payslip.setMonth(payroll.getMonth());
        payslip.setYear(payroll.getYear());
        payslip.setBasicPay(payroll.getBasicPay());
        payslip.setHra(payroll.getHra());
        payslip.setConveyance(payroll.getConveyance());
        payslip.setAllowances(payroll.getAllowances());
        payslip.setDeductions(payroll.getDeductions());
        payslip.setAbsentDaysDeduction(payroll.getAbsentDaysDeduction());
        payslip.setNetPay(payroll.getNetPay());
        payslip.setGeneratedDate(payroll.getGeneratedDate());

        if (attendance != null) {
            payslip.setTotalWorkingDays((int) attendance.getTotalDays());
            payslip.setPresentDays((int) attendance.getPresentDays());
            payslip.setAbsentDays((int) attendance.getAbsentDays());
            payslip.setLeaveDays((int) attendance.getLeaveDays());
        }

        return payslip;
    }

    private PayrollDto mapToDto(Payroll payroll) {
        PayrollDto dto = new PayrollDto();
        dto.setPayrollId(payroll.getPayrollId());
        dto.setEmployeeId(payroll.getEmployeeId());
        dto.setMonth(payroll.getMonth());
        dto.setYear(payroll.getYear());
        dto.setBasicPay(payroll.getBasicPay());
        dto.setHra(payroll.getHra());
        dto.setConveyance(payroll.getConveyance());
        dto.setAllowances(payroll.getAllowances());
        dto.setDeductions(payroll.getDeductions());
        dto.setAbsentDaysDeduction(payroll.getAbsentDaysDeduction());
        dto.setNetPay(payroll.getNetPay());
        dto.setStatus(payroll.getStatus());
        dto.setGeneratedDate(payroll.getGeneratedDate());
        return dto;
    }

    /**
     * Derive a grade from the employee's designation for salary structure lookup.
     * Example: "Software Engineer" -> "B", "Manager" -> "A", "Intern" -> "C"
     * This can be customized as needed.
     */
    private String deriveGrade(String designation) {
        if (designation == null) {
            return "B"; // default grade
        }
        String des = designation.toLowerCase();
        if (des.contains("manager") || des.contains("director") || des.contains("lead")) {
            return "A";
        } else if (des.contains("intern") || des.contains("trainee")) {
            return "C";
        } else if (des.contains("senior") || des.contains("architect")) {
            return "A";
        }
        return "B"; // default/standard grade
    }
}