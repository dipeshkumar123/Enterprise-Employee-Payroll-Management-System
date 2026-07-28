package com.payroll.payroll.client;

import com.payroll.payroll.dto.EmployeeDto;
import com.payroll.payroll.exception.ResourceNotFoundException;
import com.payroll.payroll.exception.ServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Component
public class EmployeeClient {

    private static final Logger log = LoggerFactory.getLogger(EmployeeClient.class);

    private final RestTemplate restTemplate;
    private final String employeeServiceUrl;

    public EmployeeClient(RestTemplate restTemplate,
                          @Value("${employee.service.url:http://localhost:8082/employees}") String employeeServiceUrl) {
        this.restTemplate = restTemplate;
        this.employeeServiceUrl = employeeServiceUrl;
    }

    public EmployeeDto getEmployeeById(Long employeeId) {
        try {
            String url = employeeServiceUrl + "/" + employeeId;
            log.debug("Calling Employee Service: {}", url);
            EmployeeDto employee = restTemplate.getForObject(url, EmployeeDto.class);
            if (employee == null) {
                throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
            }
            return employee;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (ResourceAccessException e) {
            log.error("Employee Service unavailable: {}", e.getMessage());
            throw new ServiceUnavailableException("Employee-Service",
                    "Cannot reach Employee Service at " + employeeServiceUrl + ". " + e.getMessage());
        } catch (Exception e) {
            log.error("Error fetching employee {}: {}", employeeId, e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
            }
            throw new ServiceUnavailableException("Employee-Service",
                    "Unexpected error: " + e.getMessage());
        }
    }
}