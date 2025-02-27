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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(cors());
app.use(express.json());
app.use("/codeblocks", codeBlockRoutes);

const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", ({ roomId }) => {
    // If the user was in a different room before, leave it
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);
    }

    // Assign the new room to the user
    socket.currentRoom = roomId;
    socket.join(roomId);

    // If the room does not exist, assign the first user as the mentor
    if (!rooms.has(roomId)) {
      rooms.set(roomId, socket.id);
      socket.emit("setMentor", true); // Notify the user they are the mentor
    } else {
      socket.emit("setMentor", false); // Notify the user they are a student
    }

    updateUserCount(roomId);
  });

  // Handle code changes and broadcast to others in the room
  socket.on("codeChange", ({ roomId, code, matches }) => {
    // Send both the code and solution match status
    socket.to(roomId).emit("updateCode", code);
    socket.to(roomId).emit("solutionMatch", matches);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    if (socket.currentRoom) {
      handleLeave(socket, socket.currentRoom);
    }
  });

  // Function to handle user leaving a room
  function handleLeave(socket, roomId) {
    // If the mentor leaves, notify students and remove the room
    if (rooms.get(roomId) === socket.id) {
      io.to(roomId).emit("mentorLeft"); // Notify students
      rooms.delete(roomId); // Delete room
    }

    socket.leave(roomId); // Remove user from room
    updateUserCount(roomId); // Update remaining user count
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
