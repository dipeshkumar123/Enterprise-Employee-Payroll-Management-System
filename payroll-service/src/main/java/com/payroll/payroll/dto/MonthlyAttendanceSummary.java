package com.payroll.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyAttendanceSummary {
    private Long employeeId;
    private int year;
    private int month;
    private long totalDays;
    private long presentDays;
    private long absentDays;
    private long leaveDays;
    private long halfDays;
}