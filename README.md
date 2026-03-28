# GoDo - Modern MERN To-Do Application

GoDo is a full-stack, feature-rich Task Management application built with the MERN (MongoDB, Express, React, Node) stack. It features a premium Glassmorphism UI, real-time drag-and-drop reordering, data exports, and comprehensive task analytics.

![GoDo App Preview](https://via.placeholder.com/800x400?text=GoDo+Dashboard+Preview)

## ✨ Key Features

- **🔐 Secure Authentication**: Full user signup and login flow using JWT and Bcrypt encryption.
- **📊 Intuitive Dashboard**: Visual statistics for total, pending, and completed tasks including a productivity chart.
- **📝 Comprehensive Task Management**: 
  - Create, edit, and delete tasks with categories and priority levels.
  - Mark tasks as completed with a single click.
  - Set specific due dates for better scheduling.
- **🔄 Drag-and-Drop Reordering**: Intuitively organize your lists with persistent sorting synced to the database.
- **📅 Interactive Calendar View**: Powered by `react-big-calendar`, enabling visual planning of upcoming deadlines.
- **📥 Data Export (PDF/CSV)**: Export your task data in professional table formats for offline reporting.
- **🌓 Dark Mode Support**: Sleek, eye-pleasing dark theme with persistent local storage sync.
- **📸 Profile Management**: Custom avatar uploads (Multer-integrated) and secure profile updates.
- **🔔 Smart Reminders**: Automated dashboard notifications for tasks due "today".
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewports.

## 🛠️ Tech Stack

- **Frontend**: 
  - [React.js](https://reactjs.org/) (Vite)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/) (Animations)
  - [dnd-kit](https://dndkit.com/) (Drag & Drop)
  - [Axios](https://axios-http.com/) (API Integration)
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
  - [JWT](https://jwt.io/) (Authentication)
  - [Multer](https://github.com/expressjs/multer) (File Uploads)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/godo-todo-app.git
   cd godo-todo-app
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   cp .env.example .env
   # Start the server
   node server.js
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Start the development server
   npm run dev
   ```

## 🏗️ Project Structure

```bash
├── backend/
│   ├── public/             # Static files and user uploads
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # API business logic
│   │   ├── middleware/     # Auth & Upload filters
│   │   ├── models/         # Mongoose schemas
│   │   └── routes/         # Express API endpoints
│   └── server.js           # Main entry point
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # UI building blocks
│   │   ├── context/        # State management (Auth/Tasks)
│   │   ├── pages/          # Full page views
│   │   └── utils/          # API axios config
│   └── index.css           # Global styles and design tokens
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
