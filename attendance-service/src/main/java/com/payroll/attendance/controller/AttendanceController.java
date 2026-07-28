package com.payroll.attendance.controller;

import com.payroll.attendance.dto.AttendanceDto;
import com.payroll.attendance.dto.AttendanceRequestDto;
import com.payroll.attendance.dto.AttendanceUpdateDto;
import com.payroll.attendance.dto.MonthlySummaryDto;
import com.payroll.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private static final Logger log = LoggerFactory.getLogger(AttendanceController.class);
    private final AttendanceService attendanceService;
    @Value("${jwt.secret}") private String jwtSecret;
    @Value("${employee.service.url:http://employee-service:8082}") private String employeeServiceUrl;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /**
     * POST /attendance
     * Mark attendance for an employee on a given date.
     * Returns 409 Conflict if attendance already exists for that day.
     */
    @PostMapping
    public ResponseEntity<AttendanceDto> markAttendance(@Valid @RequestBody AttendanceRequestDto request) {
        log.info("Marking attendance for employee {}", request.getEmployeeId());
        AttendanceDto created = attendanceService.markAttendance(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/me")
    public ResponseEntity<AttendanceDto> markMyAttendance(@RequestHeader("Authorization") String authorization) {
        Claims claims = claims(authorization);
        String username = claims.getSubject();
        @SuppressWarnings("unchecked") List<String> roles = claims.get("roles", List.class);
        if (roles == null || !roles.contains("EMPLOYEE")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        @SuppressWarnings("unchecked") Map<String, Object> employee = new RestTemplate()
                .getForObject(employeeServiceUrl + "/employees/by-username/{username}", Map.class, username);
        if (employee == null || employee.get("employeeId") == null) return ResponseEntity.notFound().build();
        AttendanceRequestDto request = new AttendanceRequestDto();
        request.setEmployeeId(((Number) employee.get("employeeId")).longValue());
        request.setDate(java.time.LocalDate.now());
        request.setStatus(com.payroll.attendance.enums.AttendanceStatus.PRESENT);
        request.setCheckInTime(java.time.LocalTime.now().withNano(0));
        return new ResponseEntity<>(attendanceService.markAttendance(request), HttpStatus.CREATED);
    }

    private Claims claims(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes())).build()
                .parseClaimsJws(authorization.substring(7)).getBody();
    }

    @GetMapping
    public ResponseEntity<List<AttendanceDto>> getAttendance(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer limit) {
        return ResponseEntity.ok(attendanceService.getAttendance(year, month, limit));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getMonthlyTotals(@RequestParam int year, @RequestParam int month) {
        return ResponseEntity.ok(attendanceService.getMonthlyTotals(year, month));
    }

    /**
     * PUT /attendance/{id}
     * Update an existing attendance record (status, check-in/out times).
     * All fields are optional.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AttendanceDto> updateAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceUpdateDto request) {
        AttendanceDto updated = attendanceService.updateAttendance(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * GET /attendance/{employeeId}
     * Get all attendance records for an employee, ordered by date descending.
     */
    @GetMapping("/{employeeId}")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByEmployee(@PathVariable Long employeeId) {
        log.debug("Fetching attendance for employee {}", employeeId);
        List<AttendanceDto> records = attendanceService.getAttendanceByEmployee(employeeId);
        return ResponseEntity.ok(records);
    }

    /**
     * GET /attendance/monthly/{employeeId}?year=2026&month=7
     * Get a monthly attendance summary for use by the Payroll Service.
     */
    @GetMapping("/monthly/{employeeId}")
    public ResponseEntity<MonthlySummaryDto> getMonthlySummary(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month) {
        MonthlySummaryDto summary = attendanceService.getMonthlySummary(employeeId, year, month);
        return ResponseEntity.ok(summary);
    }
}
