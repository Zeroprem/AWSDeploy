import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {
  @Output() employeeAdded = new EventEmitter<Employee>();
  @Output() cancel = new EventEmitter<void>();

  employeeForm: FormGroup;
  departments: string[] = [
    'Engineering',
    'Marketing', 
    'Sales',
    'HR',
    'Finance',
    'Design',
    'Operations'
  ];

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(1), Validators.max(10000000)]]
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employee: Employee = {
        name: this.employeeForm.value.name.trim(),
        email: this.employeeForm.value.email.trim().toLowerCase(),
        department: this.employeeForm.value.department,
        salary: Number(this.employeeForm.value.salary)
      };
      this.employeeAdded.emit(employee);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      this.employeeForm.get(key)?.markAsTouched();
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this.capitalize(fieldName)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('minlength')) {
      return `${this.capitalize(fieldName)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field.hasError('maxlength')) {
      return `${this.capitalize(fieldName)} cannot exceed ${field.errors?.['maxlength'].requiredLength} characters`;
    }
    if (field.hasError('min')) {
      return 'Salary must be greater than 0';
    }
    if (field.hasError('max')) {
      return 'Salary cannot exceed $10,000,000';
    }
    return '';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

