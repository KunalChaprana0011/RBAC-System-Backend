
# RBAC(Role Based Access Control) SYSTEM 

This project implements a simple Role-Based Access Control (RBAC) system using Node.js and Express.js. The system manages user roles and restricts access to certain routes based on those roles. It includes user authentication, role-based authorization, and logging of access attempts.

## Objectives
- Develop a basic RBAC system in a Node.js application using Express.js.
- Manage user roles and restrict access to routes based on those roles.
## Prerequisites
- Node.js (version 14.x or higher)
- MongoDB
- Mongoose
- Express
- bcrypt
- nodemon
- npm(node package manager)
- Postman
- jsonwebtoken
- dotenv
## Roles and Permissions
- Admin : Access all routes.
- User  : Access user-specific routes.
- Guest : Access public routes.

## Routes
- `/public`: Accessible by everyone
- `/user`: Accessible by User and Admin
- `/admin`: Accessible only by Admin
## Endpoints
- Registration: POST `/auth/register`
- Login: POST `/auth/login`
- Public Route: GET `/public`
- User Route: GET `/user`
- Admin Route: GET `/admin`
- Update Role Route(Admin only) : PUT `/admin/update-role/${id}`
## Environment Variables

You need to configure your environment variables to run this project. Create a `.env` file in the root of the project and add the following details:

```bash

PORT : 3000
MONGODB_URI : 
JWT_SECRET_KEY : 
```
## Features

- **Roles**: Admin, User, Guest
- **Routes**:
  - `/public`: Open to all
  - `/user`: Accessible by User and Admin
  - `/admin`: Restricted to Admin only
  - `/auth/register` : To register the person
  - `/auth/login` : To login the person
  - `/admin/update-role/${id}` : to update the person's role
- **Authentication**: JWT-based login with role information
- **Authorization**: Middleware for role-based access control
- **Error Handling**: 
  - `401 Unauthorized` for invalid/missing tokens
  - `403 Forbidden` for insufficient permissions
- **Logging**: Records access attempts to protected routes
- **Extras**: Role updates and input validation and sanitation