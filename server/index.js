import express from "express";
import ht from "http"
import path from "path";
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import utilidade from './src/utilidade.js'
import * as proc from 'child_process'

const app = express()
const server = ht.createServer(app);
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

let messages = []


const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
  });
  
  io.on("connection", (socket) => {
    console.log(`a user connected o ${socket.id}`);
    socket.emit("receive_message", messages);

    const start = proc.spawn('ls')
    start.stdout.on('data', (data) => {
      const oxe = data.toString()
        console.log('ok ok rodou')
        // (/\d{2}\/\d{2}\/\d{2}/)
        messages = data.toString()
    });


    utilidade.utilidade(socket, messages)
    
    socket.on("send_message", (data) => {
        // messages.push(data.message)
        console.log('ok recebi uma mensagem', data.message)
      socket.emit("receive_message", messages);
    });
  });

  server.listen(4000, () => {
    console.log("listening on *:4000");
  });
