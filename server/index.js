import express from "express";
import http from "http"; // Para criar servidor HTTP
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.DEV ? "*" : `http://${process.env.IP}:3000`,
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

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5173", // Porta do Vite
    changeOrigin: true,
    ws: true
  })
);

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
});

// Inicia o servidor na porta 4000
server.listen(4000, process.env.IP, () => {
  console.log(`Servidor rodando em http://${process.env.IP}:4000`);
});
