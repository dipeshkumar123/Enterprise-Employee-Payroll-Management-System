package com.payroll.payroll.exception;

public class InvalidPayrollDataException extends RuntimeException {
    public InvalidPayrollDataException(String message) {
        super(message);
    }
}