/**
 * Server setup and WebSocket handling for a real-time collaborative coding environment.
 * 
 * @module Server
 */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const codeBlockRoutes = require("./routes/codeBlocks");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(cors());
app.use(express.json());
app.use("/codeblocks", codeBlockRoutes);

/**
 * Stores active rooms and their mentors.
 * @type {Map<string, string>}
 */
const rooms = new Map();

/**
 * Stores room states, including code and match status.
 * @type {Map<string, {code: string|null, matches: boolean}>}
 */
const roomStates = new Map();

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ roomId }) => {
    // If the user was in a different room before, leave it
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }

    // Assign the new room to the user
    socket.currentRoom = roomId;
    socket.join(roomId);

    // Initialize room state if not set
    if (!roomStates.has(roomId)) {
      roomStates.set(roomId, { code: null, matches: false });
    }

    // Assign the first user in a room as the mentor
    if (!rooms.has(roomId)) {
      rooms.set(roomId, socket.id);
      socket.emit("setMentor", true);
    } else {
      socket.emit("setMentor", false);
    }

    // Send stored state to the user if available
    const roomState = roomStates.get(roomId);
    if (roomState && roomState.code) {
      setTimeout(() => {
        socket.emit("initialState", roomState);
      }, 100);
    }

    updateUserCount(roomId);
  });

  // Handle code changes and broadcast to the room
  socket.on("codeChange", ({ roomId, code, matches }) => {
    roomStates.set(roomId, { code, matches }); // Store the current state
    socket.to(roomId).emit("updateCode", code);
    io.to(roomId).emit("solutionMatch", matches);
  });

  // Handle mentor sending hints to students
  socket.on("sendHint", ({ roomId, hint }) => {
    if (rooms.get(roomId) === socket.id) {
      socket.to(roomId).emit("showHint", hint);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    if (socket.currentRoom) {
      handleLeave(socket, socket.currentRoom);
    }
  });

  socket.on("leaveRoom", (roomId) => {
    handleLeave(socket, roomId);
  });

  // Function to handle user leaving a room
  function handleLeave(socket, roomId) {
    // If the mentor leaves, notify students and remove the room
    if (rooms.get(roomId) === socket.id) {
      io.to(roomId).emit("mentorLeft");
      rooms.delete(roomId);
      roomStates.delete(roomId);
    }
    socket.leave(roomId);
    updateUserCount(roomId);
  }

  // Function to update and broadcast the number of users in the room
  function updateUserCount(roomId) {
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit("userCount", roomSize);
  }
});

// Start the server on the specified port
server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
