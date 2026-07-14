# Family Travel Tracker

A website where families can track their travel and manage user accounts.

# What to Install

1. Node.js - [Download from nodejs.org](https://nodejs.org/)
   - This includes npm (a tool to download code packages)
2. PostgreSQL - [Download from postgresql.org](https://www.postgresql.org/download/)
   - This is the database where we store user information

---

# Setup PostgreSQL Database

1. Open pgAdmin (comes with PostgreSQL) or use command line
2. Create a new database named: `family_travel_tracker`
3. Note your PostgreSQL username (usually `postgres`) and password

---

# Create .env File (Backend)

The `.env` file is in `.gitignore` so it won't be pushed to GitHub. That needs to be created locally.

1. Go to the `backend` folder
2. Create a new file named `.env`
3. Copy this and paste (put real values):

```
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=family_travel_tracker
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

Replace the values with your actual PostgreSQL password and email details.

---

# Step 1: Start the Backend

In terminal of the root folder:

cd backend
npm install
npm run dev

What this does:
- `npm install` = downloads all code packages needed for backend
- `npm run dev` = starts the backend server

Following should appear:

Backend Server running on http://localhost:3000


---

# Step 2: Start the Frontend (Open a NEW Terminal)

Open a NEW terminal and do this:

cd frontend
npm install
npm run dev


What this does:
- `npm install` = downloads all code packages needed for frontend
- `npm run dev` = starts the website

Following should appear:

VITE v7.3.1 ready in 123 ms

➜  Local:   http://localhost:5173/


---

# Step 3: Open the Website

Open this link in your browser: http://localhost:5173/

You should see the login page.

---

# Folder Explanation

backend = Server code (listens on port 3000)
- Handles logins, user data, email sending
- Talks to PostgreSQL database

frontend = Website code (listens on port 5173)
- The pages you see in browser
- Login, Dashboard, etc.

---

# Important Notes

- `.env` file is in `.gitignore` - it won't be pushed to GitHub
- This is for security (don't share passwords publicly)
- Each developer creates their own `.env` file locally
- Database name must be exactly: `family_travel_tracker`

---

# Summary

1. Install Node.js and PostgreSQL
2. Create PostgreSQL database named `family_travel_tracker`
3. Create `.env` file in backend folder with database credentials
4. Terminal 1: Run `cd backend` then `npm install` then `npm run dev`
5. Terminal 2: Run `cd frontend` then `npm install` then `npm run dev`
6. Browser: Go to http://localhost:5173
7. Test: Register and login