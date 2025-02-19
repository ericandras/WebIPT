import express from "express";
import http from "http"; // Para criar servidor HTTP
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import * as proc from 'child_process'

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.DEV ? "*" : `http://${process.env.IP}:4000`,
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());


const allowedIPs = [
  process.env.ALLOWED_IP
];

const getClientIP = (req) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (ip.includes(":")) ip = ip.split(":").pop(); // Remove "::ffff:" de IPv4 mapeado
  return ip;
};

app.use((req, res, next) => {
  const userIP = getClientIP(req);
  console.log("Tentativa de acesso do IP:", userIP);

  if (allowedIPs.includes(userIP)) {
    console.log("Acesso permitido:", userIP);
    next();
  } else {
    console.log("Acesso negado:", userIP);
    res.status(403).json({ error: "Acesso Negado" });
  }
});

const logs = (...props) => { 
  console.log('dev',process.env.DEV)
  if (process.env.DEV) {
  console.log(props)
}
}
var table='', chain='';
// 🚀 **WebSocket**
io.on("connection", (socket) => {
  const userIP = socket.handshake.address;
  console.log(`Cliente conectado: ${socket.id} - IP: ${userIP}`);

  socket.on("send_message", (msg) => {
    console.log("Mensagem recebida:", msg);
    socket.broadcast.emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });

  socket.on("define_table", (msg) => {
    table = msg.table
    chain = msg.chain
  })

  setInterval(() => {
    if(table&&table!=''&&chain&&chain!='') {
      const start = proc.spawn(`iptables -t ${table.toLocaleLowerCase()} -L ${chain.toUpperCase()} -n`,{cwd: `/${msg.path??''}`,shell: true})
      start.stdout.on('data', (data) => {
        const output = data.toString().split('\n').filter(line => line.trim() != "")
        socket.emit("update_rules", {
          table,
          chain,
          lines: output}); 
      });
    }
  }, [500])

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

app.use(
  "/",
  createProxyMiddleware({
    target: "http://127.0.0.1:5173",
    changeOrigin: true,
    ws: true,
    logLevel: "debug" // Adiciona logs detalhados
  })
);

// Inicia o servidor na porta 4000
server.listen(4000, process.env.IP, () => {
  console.log(`Servidor rodando em http://${process.env.IP}:4000`);
});
