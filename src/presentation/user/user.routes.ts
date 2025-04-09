import path from 'path';
import fs from 'fs';
import multer from "multer";
import { Router } from "express";
import { UserController } from "../user/user.controller";
import { UserService } from "../services/user.service";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');  // Asegúrate de que la ruta sea correcta
    // Verifica si la carpeta existe, si no la crea
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Define el nombre del archivo con un timestamp para evitar duplicados
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// Configuración de multer para manejo de archivos
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo de archivo (5 MB)
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];  // Tipos de archivo permitidos
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Tipo de archivo no permitido'));  // Aquí se lanza el error correctamente
    }
    cb(null, true);
  }
});

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const userService = new UserService();
    const userController = new UserController(userService);

    // Definir la ruta POST para crear usuario, incluyendo el middleware para imágenes
    router.post("/", upload.single('photoperfil'), userController.createUser); // 'photoperfil' es el campo de la imagen
    router.get("/", userController.findAllUsers);
    router.get("/:id", userController.findOneUser);
    router.patch("/:id", userController.updateUser);
    router.delete("/:id", userController.deleteUser);

    return router;
  }
}
