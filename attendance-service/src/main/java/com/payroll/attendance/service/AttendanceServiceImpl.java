package com.payroll.attendance.service;

import com.payroll.attendance.dto.AttendanceDto;
import com.payroll.attendance.dto.AttendanceRequestDto;
import com.payroll.attendance.dto.AttendanceUpdateDto;
import com.payroll.attendance.dto.MonthlySummaryDto;
import com.payroll.attendance.entity.Attendance;
import com.payroll.attendance.enums.AttendanceStatus;
import com.payroll.attendance.exception.DuplicateAttendanceException;
import com.payroll.attendance.exception.ResourceNotFoundException;
import com.payroll.attendance.repository.AttendanceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private static final Logger log = LoggerFactory.getLogger(AttendanceServiceImpl.class);
    private final AttendanceRepository attendanceRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public AttendanceDto markAttendance(AttendanceRequestDto request) {
        log.info("Marking attendance for employee {} on {}", request.getEmployeeId(), request.getDate());
        // Business rule: One attendance record per employee per day
        if (attendanceRepository.existsByEmployeeIdAndDate(request.getEmployeeId(), request.getDate())) {
            throw new DuplicateAttendanceException(
                "Attendance already marked for employee ID " + request.getEmployeeId()
                + " on " + request.getDate()
            );
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(request.getEmployeeId());
        attendance.setDate(request.getDate());
        attendance.setStatus(request.getStatus());
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());

        Attendance saved = attendanceRepository.save(attendance);
        log.info("Attendance marked with id: {}", saved.getAttendanceId());
        return mapToDto(saved);
    }

    @Override
    public AttendanceDto updateAttendance(Long id, AttendanceUpdateDto request) {
        log.info("Updating attendance with id: {}", id);
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));

        // Apply only non-null fields (partial update)
        if (request.getStatus() != null)       attendance.setStatus(request.getStatus());
        if (request.getCheckInTime() != null)  attendance.setCheckInTime(request.getCheckInTime());
        if (request.getCheckOutTime() != null) attendance.setCheckOutTime(request.getCheckOutTime());

        return mapToDto(attendanceRepository.save(attendance));
    }

    @Override
    public List<AttendanceDto> getAttendanceByEmployee(Long employeeId) {
        List<Attendance> records = attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId);
        if (records.isEmpty()) {
            throw new ResourceNotFoundException("No attendance records found for employee ID: " + employeeId);
        }
        return records.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public MonthlySummaryDto getMonthlySummary(Long employeeId, int year, int month) {
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Attendance> records = attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);

        long presentDays  = attendanceRepository.countByEmployeeIdAndDateBetweenAndStatus(employeeId, startDate, endDate, AttendanceStatus.PRESENT);
        long absentDays   = attendanceRepository.countByEmployeeIdAndDateBetweenAndStatus(employeeId, startDate, endDate, AttendanceStatus.ABSENT);
        long leaveDays    = attendanceRepository.countByEmployeeIdAndDateBetweenAndStatus(employeeId, startDate, endDate, AttendanceStatus.LEAVE);
        long halfDays     = attendanceRepository.countByEmployeeIdAndDateBetweenAndStatus(employeeId, startDate, endDate, AttendanceStatus.HALF_DAY);

        return new MonthlySummaryDto(
                employeeId,
                year,
                month,
                records.size(),
                presentDays,
                absentDays,
                leaveDays,
                halfDays
        );
    }

    @Override
    public List<AttendanceDto> getAttendance(Integer year, Integer month, Integer limit) {
        List<Attendance> records;
        if (year != null && month != null) {
            LocalDate start = LocalDate.of(year, month, 1);
            records = attendanceRepository.findByDateBetween(start, start.withDayOfMonth(start.lengthOfMonth()));
        } else {
            records = attendanceRepository.findAll();
        }
        return records.stream().limit(limit == null ? Long.MAX_VALUE : Math.max(limit, 0)).map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public Map<String, Long> getMonthlyTotals(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        List<Attendance> records = attendanceRepository.findByDateBetween(start, start.withDayOfMonth(start.lengthOfMonth()));
        Map<String, Long> totals = new LinkedHashMap<>();
        totals.put("present", records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count());
        totals.put("absent", records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count());
        totals.put("leave", records.stream().filter(r -> r.getStatus() == AttendanceStatus.LEAVE).count());
        totals.put("halfDay", records.stream().filter(r -> r.getStatus() == AttendanceStatus.HALF_DAY).count());
        return totals;
    }

    private AttendanceDto mapToDto(Attendance attendance) {
        return new AttendanceDto(
                attendance.getAttendanceId(),
                attendance.getEmployeeId(),
                attendance.getDate(),
                attendance.getStatus(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime()
        );
    }
}
