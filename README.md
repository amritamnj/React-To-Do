# To-Do App (React + Node.js + MySQL)

A full-stack task management application built with React, TypeScript, Node.js, Express, and MySQL. This app allows users to create, edit, delete, and drag-and-drop tasks between columns in a Kanban-style board.

## 🚀 Features
- Create, Edit & Delete Tasks
- Drag & Drop Tasks (Reorder within columns)
- Create, Edit & Delete Columns
- Dark Mode Toggle 🌙
- Persistent Data Storage (MySQL database)
- Secure API with Node.js & Express
- Mobile Responsive Design

## 🛠️ Tech Stack

| Technology                      | Usage               |
|----------------------------------|---------------------|
| React + TypeScript               | Frontend UI         |
| Tailwind CSS                     | Styling             |
| Node.js + Express                | Backend API         |
| MySQL                            | Database            |
| @hello-pangea/dnd                | Drag & Drop Functionality |
| Vercel / Netlify (Optional)      | Deployment          |

## 📸 Screenshots

### Light Mode 🌞

![image](https://github.com/user-attachments/assets/af5393e0-6f7e-46d3-b385-0c4783958a18)

### Dark Mode 🌙

![image](https://github.com/user-attachments/assets/ebbd4a96-1a94-45d8-a5b8-be092384c26b)

## 📂 Folder Structure

```
/to-do
 ├── /backend        # Express API & Database
 │   ├── server.js   # Main Backend Logic
 │   ├── db.js       # MySQL Database Connection
 │   ├── /routes     # API Routes
 ├── /src            # React Frontend
 │   ├── /components # UI Components
 │   ├── App.tsx     # Main App File
 │   ├── index.tsx   # Entry Point
 ├── package.json    # Dependencies
 ├── README.md       # Documentation
```
## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/todo-kanban.git
cd todo-kanban
```
### 2️⃣ Backend Setup (Node.js + MySQL)

Create a MySQL Database and update the `db.js` file with your credentials.

Run the backend:

```
cd backend
npm install
node server.js
```
### 3️⃣ Frontend Setup (React)
```
cd ../frontend
npm install
npm start
```
Then open `http://localhost:3000` in your browser.

## 🔗 API Endpoints

| Method | Endpoint                 | Description             |
|--------|--------------------------|-------------------------|
| GET    | /columns                 | Get all columns         |
| POST   | /columns                 | Create a new column     |
| DELETE | /columns/:id             | Delete a column         |
| POST   | /tasks                   | Create a task           |
| POST   | /tasks/:id/update        | Edit a task             |
| DELETE | /tasks/:id               | Delete a task           |
| POST   | /tasks/:id/move          | Move a task             |

## 👨‍💻 Future Enhancements

- User Authentication (Login/Signup)
- Task Due Dates & Priorities
- Real-time Sync (WebSockets)

## ⭐ Contribute

Pull requests are welcome! Feel free to open an issue or suggest improvements.
