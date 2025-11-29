# 🚀 TaskFlow - Modern Task Management App

![TaskFlow](https://img.shields.io/badge/React-18.2.0-blue)
![TaskFlow](https://img.shields.io/badge/Node.js-Express-green)
![TaskFlow](https://img.shields.io/badge/MongoDB-Atlas-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

A beautiful and efficient task management application with Kanban board, real-time notifications, and drag & drop functionality.

## ✨ Features

### ✅ Fully Implemented & Working
- 📋 **Task Management** - Complete CRUD operations
- 🎯 **Kanban Board** - Drag & drop with multiple columns  
- 🔔 **Due Date Notifications** - Backend notification system
- ⚡ **Real-time Collaboration** - Live updates with Socket.io
- 👤 **User Authentication** - Secure login system
- 📱 **Responsive Design** - Works on all devices
- 🗄️ **MongoDB Database** - Cloud database with Mongoose

### 🔄 Real-time Features
- 🔄 **Live Task Updates** - Tasks sync across all users in real-time
- 🎯 **Instant Status Changes** - Drag & drop updates immediately
- 👥 **User Presence** - See connected users online
- 🔌 **Connection Status** - Live connection indicator
- 📨 **Real-time Events** - Create, update, delete operations broadcast instantly

### 🚧 Coming Soon
- ⚡ Real-time Collaboration (Socket.io)
- 💬 Comments System
- 👥 Team Management  
- ⏱️ Time Tracking
- 📊 Analytics Dashboard
- 🔔 Advanced Notifications

## 📸 Screenshots

<div align="center">

### Home Page
<img src="./screenshots/home.png" alt="Home Page" width="800"/>

### Login 
<img src="./screenshots/login.png" alt="Login" width="800"/>

### Register
<img src="./screenshots/register.png" alt="Register" width="800"/>

### Dashboard
<img src="./screenshots/dashboard.png" alt="Dashboard" width="800"/>

### Tasks Kanban Board 
<img src="./screenshots/task_kanban.png" alt="Task Kanban Board" width="800"/>

### Tasks List View 
<img src="./screenshots/task_list.png" alt="Task List View" width="800"/>

### Create New Task
<img src="./screenshots/create_new_task.png" alt="Create New Task" width="800"/>

### Notification
<img src="./screenshots/notif.png" alt="Notification" width="800"/>

</div>

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- React Router DOM
- Context API for State Management
- CSS3 with modern animations
- Axios for API calls

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Real-time:**
- WebSocket connections
- Room-based messaging
- Event-driven architecture
- Connection state management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chelbapolandaa/taskflow-app.git
   cd taskflow-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**

Frontend: http://localhost:5173

Backend API: http://localhost:5000

## 🔑 Demo Account

Use these credentials to test the app:

Email: demo@taskflow.com

Password: password

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set environment variables
3. Deploy!

### Backend (Railway/Render)
1. Upload backend folder
2. Set environment variables
3. Deploy!

### Database
- MongoDB Atlas already cloud-based

## 📸 Screenshots

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Chelba Polanda
GitHub: @chelbapolandaa

⭐ Star this repository if you find it helpful!
