# Shopper-App  
A MERN stack web app for seamless e-commerce with features like user authentication, cart management, and admin controls. This app was built to mainly showcase my testing skills in API testing as well as GUI testing.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup](#setup)
4. [Folder Structure](#folder-structure)


## Features
- User authentication with JWT
- Add/remove products to/from cart
- Admin panel for product management
- Cloud-based database with MongoDB Atlas
- Fully containerized using Docker

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Containerization**: Docker
- **Testing**: Supertest, Chai, Cypress

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/abutidev/Online_Store.git
   cd (root directory)

2. Build and run the project:
   ```bash
     docker-compose up --build
3. Access the app:
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:5173
  
4. How to run the automated tests:
   - Ensure your application is running and you've run the dcoker-compose command
   - API tests: npx mocha
   - GUI tests:
       - npx cypress open #open cypress UI
       - npx run #headless mode
     

## Folder Structure
- **Frontend**: React application for user interface
- **Backend**: Express API for handling requests
- **Admin**: React admin panel for managing products
- **API-tests**: Automated tests for backend endpoints using Supertest and Chai.
- **GUI-testing**:  End-to-end tests for the user interface using Cypress.
