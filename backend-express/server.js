const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("lockContact", (contactId) => {
    io.emit("contactLocked", { contactId });
  });

  socket.on("unlockContact", (contactId) => {
    io.emit("contactUnlocked", { contactId });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
