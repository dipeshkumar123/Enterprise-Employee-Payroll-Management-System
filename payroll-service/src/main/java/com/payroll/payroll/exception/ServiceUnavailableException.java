package com.payroll.payroll.exception;

public class ServiceUnavailableException extends RuntimeException {
    public ServiceUnavailableException(String serviceName, String message) {
        super("Service [" + serviceName + "] unavailable: " + message);
    }
}