import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeeListComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="logo-text">
              <h1>Employee Hub</h1>
              <span class="tagline">Streamlined Workforce Management</span>
            </div>
          </div>
          <div class="header-decoration"></div>
        </div>
      </header>
      
      <main class="main-content">
        <app-employee-list></app-employee-list>
      </main>
      
      <footer class="app-footer">
        <p>&copy; 2024 Employee Management System. Built with Angular & Spring Boot by Premchand Tarange</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      padding: 2rem 2rem 3rem;
      position: relative;
      overflow: hidden;
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      animation: fadeInUp 0.6s ease-out;
    }

    .logo-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px var(--shadow-color);
    }

    .logo-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .logo-text h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 600;
      background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.125rem;
    }

    .tagline {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .header-decoration {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(233, 69, 96, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .main-content {
      flex: 1;
      padding: 0 2rem 3rem;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
    }

    .app-footer {
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.875rem;
      border-top: 1px solid var(--card-border);
      margin-top: auto;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .app-header {
        padding: 1.5rem 1rem 2rem;
      }

      .main-content {
        padding: 0 1rem 2rem;
      }

      .logo-text h1 {
        font-size: 1.5rem;
      }

      .logo-icon {
        width: 48px;
        height: 48px;
      }
    }
  `]
})
export class AppComponent {}

