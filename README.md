# Home Bakery Order Management System

Full-stack starter application:
- Backend: Java 17+, Spring Boot, Spring Web, Spring Data JPA, MySQL
- Frontend: React + Vite
- REST APIs between React and Spring Boot

## Run backend
1. Create MySQL database: `bakery_db`
2. Edit `bakery-backend/src/main/resources/application.properties`
3. Run:
   `cd bakery-backend`
   `mvn spring-boot:run`

Backend: http://localhost:8080

## Run frontend
1. Install Node.js 18+
2. Run:
   `cd bakery-frontend`
   `npm install`
   `npm run dev`

Frontend: http://localhost:5173

## Starter API
- GET /api/products
- POST /api/products
- GET /api/orders
- POST /api/orders
- PUT /api/orders/{id}/status

This starter includes product listing, order creation, order confirmation, total calculation, customization summary, delivery status, and a baker-side order dashboard.
