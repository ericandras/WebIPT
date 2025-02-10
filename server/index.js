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

const logs = (...props) => { 
  console.log('dev',process.env.DEV)
  if (process.env.DEV) {
  console.log(props) 

} 
}

const io = new Server(server, {
    cors: { origin: process.env.DEV ? '*' : `http://${process.env.IP}:3000`, methods: ["GET", "POST"] },
    // cors: { origin: '*', methods: ["GET", "POST"] },
  });
 
  
  io.on("connection", (socket) => {
    logs(`a user connected o ${socket.id}`);
    
    socket.on("input_command", (msg) => {
      logs("recebeu:", msg)
        const start = proc.spawn(msg.command,{cwd: `/${msg.path??''}`,shell: true})
    start.stdout.on('data', (data) => {
      const output = data.toString().split('\n').filter(line => line.trim() != "")
      logs("input:",msg.command)
      logs("output:",data.toString())
      logs("treated_output:",output)
      socket.emit("output_command", {lines: output}); 
    });

    start.stderr.on("data", data => {
      console.error('data error:',data.toString())
    })

    start.on('close', (code) => {
      logs("input:",msg.command)
      logs(`Command finished with exit code: ${code}`);
    });
      
    });
  });

  server.listen(4000, process.env.IP, () => {
    logs(`listening on http://${process.env.IP}:4000`);
  });
