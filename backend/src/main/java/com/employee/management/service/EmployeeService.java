package com.employee.management.service;

import com.employee.management.entity.Employee;
import com.employee.management.exception.ResourceNotFoundException;
import com.employee.management.exception.DuplicateEmailException;
import com.employee.management.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Get all employees
     */
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /**
     * Get employee by ID
     */
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    /**
     * Create a new employee
     */
    public Employee createEmployee(Employee employee) {
        // Check for duplicate email
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new DuplicateEmailException("Employee with email '" + employee.getEmail() + "' already exists");
        }
        return employeeRepository.save(employee);
    }

    /**
     * Update an existing employee
     */
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);
        
        // Check if email is being changed and if new email already exists
        if (!employee.getEmail().equals(employeeDetails.getEmail()) 
                && employeeRepository.existsByEmail(employeeDetails.getEmail())) {
            throw new DuplicateEmailException("Employee with email '" + employeeDetails.getEmail() + "' already exists");
        }
        
        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setSalary(employeeDetails.getSalary());
        
        return employeeRepository.save(employee);
    }

    /**
     * Delete an employee
     */
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
}

