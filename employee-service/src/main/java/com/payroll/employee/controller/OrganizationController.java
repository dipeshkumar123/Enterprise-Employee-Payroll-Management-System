package com.payroll.employee.controller;

import com.payroll.employee.entity.Department;
import com.payroll.employee.entity.Designation;
import com.payroll.employee.repository.DepartmentRepository;
import com.payroll.employee.repository.DesignationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrganizationController {
    private final DepartmentRepository departments;
    private final DesignationRepository designations;

    public OrganizationController(DepartmentRepository departments, DesignationRepository designations) {
        this.departments = departments;
        this.designations = designations;
    }

    @GetMapping("/departments") public List<Department> listDepartments() { return departments.findAll(); }
    @PostMapping("/departments") public ResponseEntity<Department> createDepartment(@RequestBody Department department) { return ResponseEntity.status(HttpStatus.CREATED).body(departments.save(department)); }
    @PutMapping("/departments/{id}") public Department updateDepartment(@PathVariable Long id, @RequestBody Department input) { input.setId(id); return departments.save(input); }
    @DeleteMapping("/departments/{id}") public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) { departments.deleteById(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/designations") public List<Designation> listDesignations() { return designations.findAll(); }
    @PostMapping("/designations") public ResponseEntity<Designation> createDesignation(@RequestBody Designation designation) { return ResponseEntity.status(HttpStatus.CREATED).body(designations.save(designation)); }
    @PutMapping("/designations/{id}") public Designation updateDesignation(@PathVariable Long id, @RequestBody Designation input) { input.setId(id); return designations.save(input); }
    @DeleteMapping("/designations/{id}") public ResponseEntity<Void> deleteDesignation(@PathVariable Long id) { designations.deleteById(id); return ResponseEntity.noContent().build(); }
}
