package com.payroll.attendance.repository;

import com.payroll.attendance.entity.Attendance;
import com.payroll.attendance.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Check for duplicate attendance on same day (business rule enforcement)
    boolean existsByEmployeeIdAndDate(Long employeeId, LocalDate date);

    // Used in update: find existing record to check ownership
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    // Get all attendance records for one employee (GET /attendance/{employeeId})
    List<Attendance> findByEmployeeIdOrderByDateDesc(Long employeeId);

    // Get records for a specific employee within a date range (monthly summary)
    List<Attendance> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // Count records by status for monthly summary
    long countByEmployeeIdAndDateBetweenAndStatus(Long employeeId, LocalDate startDate, LocalDate endDate, AttendanceStatus status);
}
