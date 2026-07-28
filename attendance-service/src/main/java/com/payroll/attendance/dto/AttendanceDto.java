package com.payroll.attendance.dto;

import com.payroll.attendance.enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDto {
    private Long attendanceId;
    private Long employeeId;
    private LocalDate date;
    private AttendanceStatus status;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
}
