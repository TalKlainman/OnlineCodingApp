#Online Coding App

This project is a real-time collaborative coding platform where multiple users can join coding sessions,
edit code together, and receive live feedback from a mentor. 
Mentors can send hints, and all changes are synchronized instantly across participants.

##Features

– Changes made by any participant are synchronized across all users in the session.
– The mentor can send hints in real-time, which instantly appear on the student's screen to assist.
– Users can work on the same code simultaneously using WebSocket (Socket.IO).
– The system checks if the student's solution matches the expected output.
– Displays the number of active participants in each coding session.

###Tech Stack

Frontend - React , CodeMirror 
Backend - Node.js ,Express , MongoDB 
Real-time Communication - Socket.IO 

####Deployment

The project is deployed on Render (backend) and Vercel (frontend):
Frontend: https://online-coding-app-eta.vercel.app
Backend: https://onlinecodingapp.onrender.com
