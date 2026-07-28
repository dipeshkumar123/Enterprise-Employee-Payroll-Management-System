package com.payroll.payroll.config;

import com.payroll.payroll.entity.SalaryStructure;
import com.payroll.payroll.repository.SalaryStructureRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SalaryStructureRepository salaryStructureRepository;

    public DataSeeder(SalaryStructureRepository salaryStructureRepository) {
        this.salaryStructureRepository = salaryStructureRepository;
    }

    @Override
    public void run(String... args) {
        if (salaryStructureRepository.count() == 0) {
            // Grade A: Manager / Senior / Director / Lead
            SalaryStructure gradeA = new SalaryStructure();
            gradeA.setGrade("A");
            gradeA.setBasicPay(new BigDecimal("70000.00"));
            gradeA.setHra(new BigDecimal("28000.00"));
            gradeA.setConveyance(new BigDecimal("5000.00"));
            gradeA.setBonus(new BigDecimal("10000.00"));
            gradeA.setPerDayDeduction(new BigDecimal("3500.00"));
            salaryStructureRepository.save(gradeA);

            // Grade B: Standard (Software Engineer, default)
            SalaryStructure gradeB = new SalaryStructure();
            gradeB.setGrade("B");
            gradeB.setBasicPay(new BigDecimal("40000.00"));
            gradeB.setHra(new BigDecimal("16000.00"));
            gradeB.setConveyance(new BigDecimal("3000.00"));
            gradeB.setBonus(new BigDecimal("5000.00"));
            gradeB.setPerDayDeduction(new BigDecimal("2000.00"));
            salaryStructureRepository.save(gradeB);

            // Grade C: Intern / Trainee
            SalaryStructure gradeC = new SalaryStructure();
            gradeC.setGrade("C");
            gradeC.setBasicPay(new BigDecimal("20000.00"));
            gradeC.setHra(new BigDecimal("8000.00"));
            gradeC.setConveyance(new BigDecimal("1500.00"));
            gradeC.setBonus(new BigDecimal("2000.00"));
            gradeC.setPerDayDeduction(new BigDecimal("1000.00"));
            salaryStructureRepository.save(gradeC);
        }
    }
}