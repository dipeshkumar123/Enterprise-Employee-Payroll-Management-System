package com.payroll.payroll.client;

import com.payroll.payroll.dto.MonthlyAttendanceSummary;
import com.payroll.payroll.exception.ServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Component
public class AttendanceClient {

    private static final Logger log = LoggerFactory.getLogger(AttendanceClient.class);

    private final RestTemplate restTemplate;
    private final String attendanceServiceUrl;

    public AttendanceClient(RestTemplate restTemplate,
                            @Value("${attendance.service.url:http://localhost:8083/attendance}") String attendanceServiceUrl) {
        this.restTemplate = restTemplate;
        this.attendanceServiceUrl = attendanceServiceUrl;
    }

    public MonthlyAttendanceSummary getMonthlyAttendance(Long employeeId, Integer month, Integer year) {
        try {
            String url = attendanceServiceUrl + "/monthly/" + employeeId + "?month=" + month + "&year=" + year;
            log.debug("Calling Attendance Service: {}", url);
            MonthlyAttendanceSummary summary = restTemplate.getForObject(url, MonthlyAttendanceSummary.class);
            if (summary == null) {
                log.warn("Attendance summary returned null for employee {} month {}/{}", employeeId, month, year);
                return new MonthlyAttendanceSummary(employeeId, year, month, 0, 0, 0, 0, 0);
            }
            return summary;
        } catch (ResourceAccessException e) {
            log.error("Attendance Service unavailable: {}", e.getMessage());
            throw new ServiceUnavailableException("Attendance-Service",
                    "Cannot reach Attendance Service on port 8083. " + e.getMessage());
        } catch (Exception e) {
            log.error("Error fetching attendance for employee {} month {}/{}: {}",
                    employeeId, month, year, e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                log.warn("No attendance data found for employee {} month {}/{}, returning empty summary",
                        employeeId, month, year);
                return new MonthlyAttendanceSummary(employeeId, year, month, 0, 0, 0, 0, 0);
            }
            throw new ServiceUnavailableException("Attendance-Service",
                    "Unexpected error: " + e.getMessage());
        }
    }
}