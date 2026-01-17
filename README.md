# Task Management System (Kanban Board)

A full-stack **Task Management Application** featuring a drag-and-drop Kanban board, user authentication, and profile management. Built using the MERN stack (MongoDB, Express, React, Node.js).

## Ì∫Ä Features

* **Authentication:** User Sign Up, Login, and Logout (JWT-based).
* **Kanban Board:** Organize tasks into **Pending**, **In Progress**, and **Completed** columns.
* **Drag & Drop:** Smoothly move tasks between statuses using `react-beautiful-dnd`.
* **Task Management:** Create, Read, Update, and Delete (CRUD) tasks.
* **User Profile:** Update name/password or delete account (cascading delete removes user tasks).
* **Filtering:** API support for filtering tasks by status.
* **Responsive UI:** Mobile-friendly design.

## Ìª†Ô∏è Tech Stack

* **Frontend:** React.js, React Router, React Beautiful DnD, Axios.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Atlas or Local).
* **Authentication:** JSON Web Tokens (JWT), Bcrypt.js.

---

## ‚öôÔ∏è Installation & Setup

### Prerequisites
* Node.js (v14 or higher)
* MongoDB (URI string)

### 1. Clone the Repository
```bash
git clone <repository_url>
cd AmanKumarSharma_123456
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add your credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev
```
*Server will run on http://localhost:5000*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd ../frontend
npm install --legacy-peer-deps
```
*(Note: --legacy-peer-deps is required for react-beautiful-dnd compatibility)*

Start the React application:
```bash
npm start
```
*Client will run on http://localhost:3000*

---

## Ì¥ë Environment Variables
Refer to `.env.example` in the backend folder.

| Variable | Description |
| :--- | :--- |
| `PORT` | Port number for the backend server (default: 5000) |
| `MONGO_URI` | Connection string for MongoDB database |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## Ì≥° API Endpoints

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login user & get token
* `PUT /api/auth/profile` - Update user profile
* `DELETE /api/auth/profile` - Delete user account

### Tasks
* `GET /api/tasks` - Get all tasks (Supports `?status=pending` filter)
* `POST /api/tasks` - Create a new task
* `PUT /api/tasks/:id` - Update task status/details
* `DELETE /api/tasks/:id` - Delete a task
