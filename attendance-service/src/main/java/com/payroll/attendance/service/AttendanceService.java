package com.payroll.attendance.service;

import com.payroll.attendance.dto.AttendanceDto;
import com.payroll.attendance.dto.AttendanceRequestDto;
import com.payroll.attendance.dto.AttendanceUpdateDto;
import com.payroll.attendance.dto.MonthlySummaryDto;

import java.util.List;

public interface AttendanceService {

    AttendanceDto markAttendance(AttendanceRequestDto request);

    AttendanceDto updateAttendance(Long id, AttendanceUpdateDto request);

    List<AttendanceDto> getAttendanceByEmployee(Long employeeId);

    MonthlySummaryDto getMonthlySummary(Long employeeId, int year, int month);

    List<AttendanceDto> getAttendance(Integer year, Integer month, Integer limit);

    java.util.Map<String, Long> getMonthlyTotals(int year, int month);
}
