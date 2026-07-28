package com.payroll.attendance.service;

import com.payroll.attendance.dto.AttendanceRequestDto;
import com.payroll.attendance.dto.AttendanceUpdateDto;
import com.payroll.attendance.dto.AttendanceDto;
import com.payroll.attendance.dto.MonthlySummaryDto;
import com.payroll.attendance.entity.Attendance;
import com.payroll.attendance.enums.AttendanceStatus;
import com.payroll.attendance.exception.DuplicateAttendanceException;
import com.payroll.attendance.exception.ResourceNotFoundException;
import com.payroll.attendance.repository.AttendanceRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @InjectMocks
    private AttendanceServiceImpl attendanceService;

    private AttendanceRequestDto requestDto;
    private Attendance attendance;

    @BeforeEach
    void setUp() {
        requestDto = new AttendanceRequestDto();
        requestDto.setEmployeeId(1L);
        requestDto.setDate(LocalDate.of(2026, 5, 1));
        requestDto.setStatus(AttendanceStatus.PRESENT);
        requestDto.setCheckInTime(java.time.LocalTime.of(9, 0));
        requestDto.setCheckOutTime(java.time.LocalTime.of(17, 0));

        attendance = new Attendance();
        attendance.setAttendanceId(1L);
        attendance.setEmployeeId(1L);
        attendance.setDate(requestDto.getDate());
        attendance.setStatus(AttendanceStatus.PRESENT);
    }

    @Test
    void markAttendance_Success() {
        when(attendanceRepository.existsByEmployeeIdAndDate(1L, requestDto.getDate())).thenReturn(false);
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(attendance);

        AttendanceDto result = attendanceService.markAttendance(requestDto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(1L, result.getAttendanceId());
        verify(attendanceRepository, times(1)).save(any(Attendance.class));
    }

    @Test
    void markAttendance_Duplicate_ThrowsException() {
        when(attendanceRepository.existsByEmployeeIdAndDate(1L, requestDto.getDate())).thenReturn(true);

        Assertions.assertThrows(DuplicateAttendanceException.class, () -> attendanceService.markAttendance(requestDto));
    }

    @Test
    void updateAttendance_Success() {
        AttendanceUpdateDto updateDto = new AttendanceUpdateDto();
        updateDto.setStatus(AttendanceStatus.HALF_DAY);

        Attendance updated = new Attendance();
        updated.setAttendanceId(1L);
        updated.setEmployeeId(1L);
        updated.setStatus(AttendanceStatus.HALF_DAY);

        when(attendanceRepository.findById(1L)).thenReturn(Optional.of(attendance));
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(updated);

        AttendanceDto result = attendanceService.updateAttendance(1L, updateDto);

        Assertions.assertNotNull(result);
        Assertions.assertEquals(AttendanceStatus.HALF_DAY, result.getStatus());
    }

    @Test
    void getAttendanceByEmployee_Success() {
        when(attendanceRepository.findByEmployeeIdOrderByDateDesc(1L)).thenReturn(List.of(attendance));

        List<AttendanceDto> results = attendanceService.getAttendanceByEmployee(1L);

        Assertions.assertFalse(results.isEmpty());
        Assertions.assertEquals(1, results.size());
    }

    @Test
    void getMonthlySummary_Success() {
        when(attendanceRepository.findByEmployeeIdAndDateBetween(eq(1L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(attendance));
        when(attendanceRepository.countByEmployeeIdAndDateBetweenAndStatus(eq(1L), any(LocalDate.class), any(LocalDate.class), eq(AttendanceStatus.PRESENT)))
                .thenReturn(1L);
        when(attendanceRepository.countByEmployeeIdAndDateBetweenAndStatus(eq(1L), any(LocalDate.class), any(LocalDate.class), eq(AttendanceStatus.ABSENT)))
                .thenReturn(0L);
        when(attendanceRepository.countByEmployeeIdAndDateBetweenAndStatus(eq(1L), any(LocalDate.class), any(LocalDate.class), eq(AttendanceStatus.LEAVE)))
                .thenReturn(0L);
        when(attendanceRepository.countByEmployeeIdAndDateBetweenAndStatus(eq(1L), any(LocalDate.class), any(LocalDate.class), eq(AttendanceStatus.HALF_DAY)))
                .thenReturn(0L);

        MonthlySummaryDto summary = attendanceService.getMonthlySummary(1L, 2026, 5);

        Assertions.assertNotNull(summary);
        Assertions.assertEquals(1, summary.getPresentDays());
        Assertions.assertEquals(0, summary.getAbsentDays());
    }
}