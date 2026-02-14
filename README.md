# Real-Time Collaborative Notes Application

A production-quality full-stack web application for creating, editing, and collaborating on notes in real time. Supports authentication, role-based access control, activity tracking, search, and public read-only sharing.

---

## GitHub Repository

[Collaborative Notes GitHub Repository](https://github.com/nikhilko-07/collaborative-notes.git)

---

## Live Deployment

- **Backend API:** [https://collaborative-notes-cx4x.vercel.app/api](https://collaborative-notes-cx4x.vercel.app/api)  
- **Frontend (Client):** [https://collaborative-notes-git-main-nikhilko-07s-projects.vercel.app/](https://collaborative-notes-git-main-nikhilko-07s-projects.vercel.app/)

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Technical Stack](#technical-stack)  
- [Features](#features)  
- [Backend Setup](#backend-setup)  
- [Frontend Setup](#frontend-setup)  
- [Environment Variables](#environment-variables)  
- [Database](#database)  
- [API Endpoints](#api-endpoints)  
- [Author](#author)

---

## Project Overview

This application allows multiple users to collaborate on notes in real time. Users can register, log in, create/edit/delete notes, manage collaborators, and share notes via public read-only links. Changes sync live using WebSockets.

---

## Technical Stack

**Frontend:** React (JS), clean state management, real-time updates  
**Backend:** Node.js + Express, REST APIs, JWT authentication, Socket.io for real-time collaboration  
**Database:** PostgreSQL (Prisma ORM)  
**Deployment:**  
- Backend: Vercel ([link](https://collaborative-notes-cx4x.vercel.app/api))  
- Frontend: Vercel ([link](https://collaborative-notes-git-main-nikhilko-07s-projects.vercel.app/))

---

## Features

1. **Authentication & Authorization**
   - User registration and login  
   - JWT-based authentication  
   - Role-based access (Admin, Editor, Viewer)  
   - API-level access restrictions  

2. **Notes Management**
   - Create, edit, delete notes  
   - Ownership and last-modified timestamps  
   - Collaborator management with permissions  

3. **Real-Time Collaboration**
   - Live multi-user editing  
   - Real-time sync with Socket.io  
   - Basic conflict handling  

4. **Activity Log**
   - Track actions (create, update, delete, share)  
   - Store timestamp, user, and note reference  

5. **Search**
   - Search notes by title/content  
   - Access-permission aware  

6. **Shareable Read-Only Links**
   - Public view-only links without login  
   - Editing restricted  

---

## Backend Setup (Server)

1. Navigate to the backend folder:

```bash
cd backend
Install dependencies:

npm install
Generate Prisma client and optionally run migrations:

npx prisma generate
# Optional (run migrations if needed)
# npx prisma migrate deploy
Open Prisma Studio to view/edit your database:

npx prisma studio
Start the server:

cd src
nodemon server.js
Server runs on port 9000 locally.

Frontend Setup (Client)
Navigate to the client folder:

cd client
Install dependencies:

npm install
Update the API base URL for local development:

Open client/src/config/index.js

Change BASE_URL to your backend URL with /api suffix, e.g.,

export const BASE_URL = "http://localhost:9000/api";
Start the React frontend:

npm start
Webpage will run locally, typically on port 3000.

Environment Variables
Create a .env file in the backend folder with the following:

DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
Make sure to also configure these in Vercel for deployment.

Database
PostgreSQL managed via Prisma

Schema located at: backend/prisma/schema.prisma

Migrations folder: backend/prisma/migrations

View and edit database via Prisma Studio:

npx prisma studio
API Endpoints
Base URL (Vercel): https://collaborative-notes-cx4x.vercel.app/api

Example Endpoints:

Endpoint	Method	Description
/auth/register	POST	Register new user
/auth/login	POST	User login
/notes	GET	Get all notes (role-based)
/notes	POST	Create new note
/notes/:id	PUT	Update note
/notes/:id	DELETE	Delete note
/notes/:id/share	POST	Generate shareable link
Notes
Backend server is Node + Express listening on dynamic process.env.PORT in production.

Real-time collaboration handled with Socket.io.

Public deployment URLs are provided above.
