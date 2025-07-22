# ClassroomManagementApp
This is a web-based classroom management system designed to help teachers organize classes, assign tasks, and track student progress effectively. The system allows teachers to create and manage classrooms, assign homework or projects to students, and monitor their completion status. It also includes real-time messaging between Teacher and Student roles using Socket.IO and Firebase, enabling instant communication and feedback.

# Teacher (Owner) Features:
Login via email with OTP verification for secure access

Add and manage students in multiple classes

Assign class tasks with title, date, time, and description

Track all assigned tasks and monitor student completion statuses

Real-time chat with students, including online presence tracking

# Student Features:
Receive email invitation to set up an account and join the class

Log in to access the student dashboard

View and complete assigned tasks

Mark tasks as completed

Chat with the teacher in real time, with online/offline status indicators

# Technology Stack
Frontend: Next.js, TailwindCSS, ShadCN UI
Backend: Express.js, Firebase Firestore
Auth: Custom email-based login with access code and password-based login 
Messaging: Socket.IO
Email: Nodemailer

# Project Structure
backend: Contains the backend source code using Node.js/Express, Firebase, Socket.IO, and Nodemailer.

frontend: Contains the frontend user interface built with Next.js, TailwindCSS.

env: Environment variable file. It should be listed in .gitignore if it contains sensitive information.

# Getting Started
front-end:

cd /front-end

npm i

npm run dev

back-end:

cd /back-end

npm i

npm run dev
