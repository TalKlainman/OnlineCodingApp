## Online Coding App

This project is a **real-time collaborative coding platform** where multiple users can join coding sessions, edit code together, and receive live feedback from a mentor. Mentors can send hints, and all changes are synchronized instantly across participants.

## Features

- **Real-time synchronization**: Changes made by any participant are synchronized across all users in the session.
- **Live mentor hints**: The mentor can send hints in real-time, which instantly appear on the student's screen to assist.
- **Collaborative coding**: Users can work on the same code simultaneously using WebSocket (**Socket.IO**).
- **Solution validation**: The system checks if the student's solution matches the expected output.
- **Participant tracking**: Displays the number of active participants in each coding session.

## Tech Stack

- **Frontend**: React, CodeMirror  
- **Backend**: Node.js, Express, MongoDB  
- **Real-time Communication**: Socket.IO  

## Deployment

The project is deployed on **Render** (backend) and **Vercel** (frontend):

- **Frontend**: [Online Coding App](https://online-coding-app-eta.vercel.app)  
- **Backend**: [Online Coding API](https://onlinecodingapp.onrender.com)
