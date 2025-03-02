#Online Coding App

This project is a real-time collaborative coding platform where multiple users can join coding sessions,
edit code together, and receive live feedback from a mentor. 
Mentors can send hints, and all changes are synchronized instantly across participants.

##Features

Live code updates – Changes made by any participant are synchronized across all users in the session.
Hints system – The mentor can send hints in real-time, which instantly appear on the student's screen to assist in problem-solving.
Real-time collaboration – Users can work on the same code simultaneously using WebSocket (Socket.IO).
Code correctness validation – The system checks if the student's solution matches the expected output.
User presence tracking – Displays the number of active participants in each coding session.

###Tech Stack

Frontend - React , CodeMirror (Code editor for syntax highlighting)
Backend - Node.js & Express (Server-side logic and API handling), MongoDB & Mongoose (Database and schema management)
Real-time Communication - Socket.IO (WebSockets for live updates)

####Deployment

The project is deployed on Render (backend) and Vercel (frontend):
Frontend: https://online-coding-app-eta.vercel.app
Backend: https://onlinecodingapp.onrender.com
