package com.payroll.attendance.controller;

import com.payroll.attendance.dto.AttendanceDto;
import com.payroll.attendance.service.AttendanceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AttendanceController.class)
class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AttendanceService attendanceService;

    @Test
    void markAttendance_ReturnsCreated() throws Exception {
        AttendanceDto dto = new AttendanceDto(1L, 1L, LocalDate.of(2026, 5, 1),
                com.payroll.attendance.enums.AttendanceStatus.PRESENT,
                LocalTime.of(9, 0), LocalTime.of(17, 0));

        when(attendanceService.markAttendance(any(com.payroll.attendance.dto.AttendanceRequestDto.class))).thenReturn(dto);

        mockMvc.perform(post("/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"employeeId\":1,\"date\":\"2026-05-01\",\"status\":\"PRESENT\",\"checkInTime\":\"09:00:00\",\"checkOutTime\":\"17:00:00\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PRESENT"));
    }

    @Test
    void getAttendanceByEmployee_ReturnsList() throws Exception {
        AttendanceDto dto = new AttendanceDto(1L, 1L, LocalDate.of(2026, 5, 1),
                com.payroll.attendance.enums.AttendanceStatus.PRESENT,
                LocalTime.of(9, 0), LocalTime.of(17, 0));

        when(attendanceService.getAttendanceByEmployee(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/attendance/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PRESENT"));
    }
}