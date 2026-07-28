package com.payroll.attendance.dto;

import com.payroll.attendance.enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

/**
 * DTO for updating existing attendance records.
 * All fields are optional to allow partial updates.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceUpdateDto {
    private AttendanceStatus status;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
}
