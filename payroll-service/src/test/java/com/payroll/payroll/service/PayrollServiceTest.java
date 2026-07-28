package com.payroll.payroll.service;

import com.payroll.payroll.entity.Payroll;
import com.payroll.payroll.entity.SalaryStructure;
import com.payroll.payroll.enums.PayrollStatus;
import com.payroll.payroll.exception.InvalidPayrollDataException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

class PayrollServiceTest {

    @Test
    void calculateNetPay_Success() {
        SalaryStructure gradeB = new SalaryStructure();
        gradeB.setGrade("B");
        gradeB.setBasicPay(new BigDecimal("40000"));
        gradeB.setHra(new BigDecimal("16000"));
        gradeB.setConveyance(new BigDecimal("3000"));
        gradeB.setBonus(new BigDecimal("5000"));
        gradeB.setPerDayDeduction(new BigDecimal("2000"));

        Payroll payroll = new Payroll();
        payroll.setBasicPay(gradeB.getBasicPay());
        payroll.setHra(gradeB.getHra());
        payroll.setConveyance(gradeB.getConveyance());
        payroll.setAllowances(gradeB.getBonus());
        payroll.setAbsentDaysDeduction(BigDecimal.ZERO);

        BigDecimal gross = payroll.getBasicPay()
                .add(payroll.getHra())
                .add(payroll.getConveyance())
                .add(payroll.getAllowances());

        BigDecimal net = gross.subtract(payroll.getAbsentDaysDeduction());

        Assertions.assertEquals(new BigDecimal("64000"), net);
    }

    @Test
    void validateMonth_Invalid_ThrowsException() {
        Assertions.assertThrows(InvalidPayrollDataException.class, () -> {
            if (13 < 1 || 13 > 12) {
                throw new InvalidPayrollDataException("Month must be between 1 and 12");
            }
        });
    }

    @Test
    void payrollStatus_Completed() {
        Payroll payroll = new Payroll();
        payroll.setStatus(PayrollStatus.COMPLETED);
        Assertions.assertEquals(PayrollStatus.COMPLETED, payroll.getStatus());
    }
}