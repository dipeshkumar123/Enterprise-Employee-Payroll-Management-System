package com.payroll.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Monthly summary of attendance for a single employee.
 * Used by the Payroll Service to calculate salary deductions.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryDto {
    private Long employeeId;
    private int year;
    private int month;
    private long totalDays;
    private long presentDays;
    private long absentDays;
    private long leaveDays;
    private long halfDays;
}
