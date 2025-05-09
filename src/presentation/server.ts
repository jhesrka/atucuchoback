// src/server.ts
import express, { Router } from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { setIO } from "../config/socket"; // Asegúrate de que la ruta sea correcta
import fs from "fs"; // Importa el módulo fs
import path from "path"; // Importa el módulo path
import helmet from "helmet";
import hpp from "hpp";

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private readonly app = express();
  private readonly server;
  private readonly io: SocketIOServer;
  private readonly port: number;
  private readonly routes: Router;
  private readonly acceptedOrigins: string[] = ["http://localhost:5173"];

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
    this.server = http.createServer(this.app); // Crear servidor HTTP
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "http://localhost:5173", // ✅ Aquí añadimos CORS para Socket.IO
        methods: ["GET", "POST"],
      },
    }); // Crear instancia de Socket.IO con configuración de CORS

    setIO(this.io); // 🔥 Guardamos la instancia globalmente
  }

  async start() {
    // Asegurarse de que el directorio "uploads" exista
    const uploadsPath = path.join(__dirname, "uploads"); // Obtiene la ruta absoluta para 'uploads'
    if (!fs.existsSync(uploadsPath)) {
      // Verifica si el directorio 'uploads' existe
      fs.mkdirSync(uploadsPath); // Si no existe, lo crea
    }

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) {
            return callback(null, true);
          }
          if (this.acceptedOrigins.includes(origin)) {
            return callback(null, true);
          }
          return callback(new Error("Not allwed by CORS"));
        },
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(hpp());
    this.app.use(helmet()); // esto es una seguridad
    this.app.use(this.routes);

    this.io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado");
    });

    this.server.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }
}
