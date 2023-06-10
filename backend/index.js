const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const socket = require("socket.io");
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')

require("dotenv").config();
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth/',userRoutes)
app.use('/api/messages/',messageRoutes)


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });
const server =   app.listen(process.env.PORT,()=>{
  console.log("Connected to DB")
})

const broad = {message:"hellp"}
const io = socket(server,{
  cors:{
    //frontend link
    origin:"http://localhost:30000",
    credentials: true
  }
})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.emit("hello", "world");
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
 //Broadcast emi
 
});
io.emit("broadcast","hello")