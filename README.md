# 📝 Console TODO App (Node.js + MySQL)

> Batch No: 18 — Simple CRUD Project

A simple **console-based TODO application** with user authentication and full task
CRUD, built with **Node.js** and **MySQL**. Users can register, log in, and manage
their own private task list right from the terminal.

---

## 🎥 Demo Video

<!-- Upload your screen recording and paste the link below -->
👉 **[Watch the full workflow video](ADD_YOUR_VIDEO_LINK_HERE)**

---

## ✨ Features

- 👤 **User Authentication** — Register & Login (passwords hashed with **bcrypt**)
- ✅ **Add Task** — title, description, due date, priority, status
- 📋 **View All Tasks** — list every task you own
- ✏️ **Edit Task** — update any field (blank input keeps the current value)
- 🗑️ **Delete Task** — with a yes/no confirmation
- 🔍 **Search Tasks** — by title or description keyword
- 🔒 **Per-user data** — every task is scoped to the logged-in user
- 🛡️ **Validation** — email format, unique email, password length, priority, dates

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Database | MySQL |
| DB Driver | [`mysql2`](https://www.npmjs.com/package/mysql2) |
| Password Hashing | [`bcryptjs`](https://www.npmjs.com/package/bcryptjs) |
| Config | [`dotenv`](https://www.npmjs.com/package/dotenv) |
| Console Input | Node `readline` |

---

## 🗄️ Database Schema

**users**

| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key, auto-increment |
| name | VARCHAR(100) | Not null |
| email | VARCHAR(150) | Unique, not null |
| password | VARCHAR(255) | bcrypt hash |

**tasks**

| Column | Type | Notes |
|--------|------|-------|
| id | INT | Primary key, auto-increment |
| userId | INT | Foreign key → users.id |
| title | VARCHAR(255) | Not null |
| description | TEXT | |
| dueDate | DATE | |
| priority | ENUM('Low','Medium','High') | Default `Low` |
| status | ENUM('Pending','Completed') | Default `Pending` |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto on update |

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MySQL](https://dev.mysql.com/downloads/) running locally

### 2. Clone & install
```bash
git clone https://github.com/<your-username>/JSToDo.git
cd JSToDo
npm install
```

### 3. Configure environment
Copy the example env file and fill in your MySQL credentials:
```bash
cp .env.example .env
```
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=todo_app
```

### 4. Create the database
```bash
mysql -u root -p < schema.sql
```

### 5. Run the app
```bash
npm start
```

---

## 📂 Project Structure

```
JSToDo/
├── src/
│   ├── db.js          # MySQL connection pool
│   ├── input.js       # Promise-based console input
│   ├── validators.js  # Email / priority / date validation
│   ├── auth.js        # Register & Login
│   └── tasks.js       # Add / View / Edit / Delete / Search
├── index.js           # Entry point & menu loops
├── schema.sql         # Database schema
├── .env.example       # Env template (committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 🧭 App Flow

```
Welcome to Todo App
  1. Register
  2. Login
  3. Exit
        │
        ▼ (after login)
Todo Menu
  1. Add Task
  2. View All Tasks
  3. Edit Task
  4. Delete Task
  5. Search Tasks
  6. Logout
```

---

## ✅ Validation Rules

| Action | Rules |
|--------|-------|
| Register | Name not empty · valid email · email unique · password ≥ 4 chars |
| Login | Valid email/password combo |
| Add / Edit Task | Title not empty · priority ∈ {Low, Medium, High} · valid `YYYY-MM-DD` date |
| Edit / Delete | Task ID must be valid and belong to the user |

---

## 📜 License

MIT
