#!/bin/bash

echo "🚀 Starting Employee Management System..."

# Kill existing processes
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:4200 | xargs kill -9 2>/dev/null

# Start Backend
echo "📦 Starting Backend (Spring Boot)..."
cd backend && mvn spring-boot:run &

# Start Frontend
echo "🎨 Starting Frontend (Angular)..."
cd frontend && npm start &

echo ""
echo "✅ Services starting..."
echo "   Backend:  http://localhost:8080"
echo "   Frontend: http://localhost:4200"
echo ""
echo "Press Ctrl+C to stop all services"

wait

