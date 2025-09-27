import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import Message from "./model/Message.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://kumarramabhishek89:admin@cluster0.84lv6bh.mongodb.net/CHITCHAT")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// REST API to fetch old messages
app.get("/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Socket.io setup
io.on("connection", (socket) => {
  console.log("🔌 New user connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    const newMessage = new Message(data);
    await newMessage.save();
    io.emit("receiveMessage", data); // broadcast to all users
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
