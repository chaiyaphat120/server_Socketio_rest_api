const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const socketio = require('socket.io');   //socket.io
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);   //socket.io

// mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack-bjf1i.mongodb.net/semana09?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

const socketInfo = {};
io.on('connection', socket => {
  const { user_id } = socket.handshake.query;  //get จาก   const socket = socketio("http://192.168.1.7:3333", { query: { user_id } }) //port : 3333  ของ backend , const user_id = "art123456"
  socketInfo.socket_id = socket.id;
  socketInfo.user_id = user_id;
  console.log("socket.id",socket.id)
});

app.use((req, res, next) => {
  req.io = io;
  req.art = "art"  //แบน req.art ไปด้วย
  req.socket_id = socketInfo.socket_id;
  req.user_id = socketInfo.user_id;
  return next();
})
app.post("/user", async (req,res)=>{
  // req.io.to(req.user_id).emit('booking_request', {"user_Id": req.user_id , "socket_id" :  req.socket_id});
  req.io.emit('booking_request', {"user_Id": req.user_id , "socket_id" :  req.socket_id});
  res.json({"user_Id": req.user_id , "socket_id" :  req.socket_id})
})
app.use(cors())
app.use(express.json());
// app.use(routes);
const port = process.env.PORT || 3333  
server.listen( port,()=>{
  console.log(`server run port ${port}`)
});
