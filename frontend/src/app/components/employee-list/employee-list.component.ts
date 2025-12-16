import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, EmployeeFormComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error: string | null = null;
  showForm = false;
  successMessage: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;
    
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employees. Please ensure the backend server is running.';
        this.loading = false;
        console.error('Error loading employees:', err);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.successMessage = null;
  }

  onEmployeeAdded(employee: Employee): void {
    this.employeeService.createEmployee(employee).subscribe({
      next: (newEmployee) => {
        this.employees.push(newEmployee);
        this.showForm = false;
        this.showSuccessMessage(`${newEmployee.name} has been added successfully!`);
      },
      error: (err) => {
        this.error = err.message || 'Failed to add employee';
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    if (!employee.id) return;
    
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== employee.id);
          this.showSuccessMessage(`${employee.name} has been removed successfully!`);
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete employee';
        }
      });
    }
  }

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 4000);
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  }

  getDepartmentColor(department: string): string {
    const colors: { [key: string]: string } = {
      'Engineering': '#00d9a5',
      'Marketing': '#e94560',
      'Sales': '#ffc93c',
      'HR': '#9b59b6',
      'Finance': '#3498db',
      'Design': '#e74c3c',
      'Operations': '#1abc9c'
    };
    return colors[department] || '#a0a0a0';
  }
}

