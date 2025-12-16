import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly API_URL = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  /**
   * Get all employees
   */
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get employee by ID
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a new employee
   */
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL, employee).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing employee
   */
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.API_URL}/${id}`, employee).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete an employee
   */
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        // Validation errors
        const errors = Object.values(error.error.errors).join(', ');
        errorMessage = `Validation failed: ${errors}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

