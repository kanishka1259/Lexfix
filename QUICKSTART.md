# 🧠 ADHD Learning Platform - Quick Start Guide

## 🎨 Color Palette
- **Terracotta**: #C65D3B
- **Warm Beige**: #E8DCC4  
- **Sage Green**: #7A9D7E
- **Deep Brown**: #4A3428
- **Cream**: #F5F1E8

## 🚀 Quick Start

### 1. Start MongoDB
Make sure MongoDB is running on your system.

### 2. Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### 3. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

## 👥 User Roles

### 👨‍🏫 Teacher
- Create learning tasks
- Add sentences for ADHD mode
- Assign tasks to students
- View student progress

### 👨‍🎓 Student
- View assigned tasks
- Use ADHD Focus Mode
- Track personal progress
- Link to parent for monitoring

### 👨‍👩‍👧 Parent
- Monitor child's activity
- View assigned tasks
- Check session history
- See learning statistics

## 🔑 First Steps

1. Go to http://localhost:3000/register
2. Choose your role (Teacher/Student/Parent)
3. Fill in your details
4. Login and explore your dashboard!

## 📚 API Endpoints

### Auth
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Tasks
- POST `/api/tasks` - Create task (Teacher)
- GET `/api/tasks` - Get tasks (role-filtered)
- PUT `/api/tasks/:id/assign` - Assign task (Teacher)

### Sessions
- POST `/api/sessions/start` - Start session
- PUT `/api/sessions/:id/end` - End session
- GET `/api/sessions` - Get all sessions

## 🎯 Features

✅ Role-based authentication  
✅ Warm professional design  
✅ ADHD-optimized learning  
✅ Parental monitoring  
✅ Task management  
✅ Progress tracking  
