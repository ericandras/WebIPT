import express from "express";
import ht from "http"
import path from "path";
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import utilidade from './src/utilidade.js'
import * as proc from 'child_process'

import 'dotenv/config'

const app = express()
const server = ht.createServer(app);
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

let messages = []


const io = new Server(server, {
    // cors: { origin: `http://${process.env.IP}:3000`, methods: ["GET", "POST"] },
    cors: { origin: '*', methods: ["GET", "POST"] },
  });

  
  io.on("connection", (socket) => {
    console.log(`a user connected o ${socket.id}`);
    
    socket.on("input_command", (msg) => {
        const start = proc.spawn(msg.command,{cwd: `/${msg.path??''}`,shell: true})
    start.stdout.on('data', (data) => {
      const output = data.toString().split('\n').filter(line => line.trim() != "")
      console.log("input:",msg.command)
      console.log("output:",data.toString())
      console.log("treated_output:",output)
      socket.emit("output_command", {lines: output});
    });
      
    });
  });

  server.listen(4000, process.env.IP, () => {
    console.log(`listening on http://${process.env.IP}:4000`);
  });
