// src/presentation/user/user.routes.ts
import { Router } from "express";
import { UserController } from "../user/user.controller";
import { UserService } from "../services/user.service";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../../config/awsConfig"; // ✅ IMPORT CORRECTA

import dotenv from 'dotenv';
import { EmailService } from "../services/email.service";
import { envs, uploadSingleFile } from "../../config";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "../../data";

dotenv.config();

// // Configuración de multer con S3
// const storage = multerS3({
//   s3,
//   bucket: process.env.AWS_BUCKET_NAME!,

//   metadata: (req, file, cb) => {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: (req, file, cb) => {
//     cb(null, `uploads/${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png'];
//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new Error('Tipo de archivo no permitido') as any, false);
//     }
//     cb(null, true);
//   },
// });

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const emailService= new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    )
    const userService = new UserService(emailService);
    const userController = new UserController(userService);

    router.get("/profile", AuthMiddleware.protect, userController.getProfile)
    router.patch("/block-account/:id", AuthMiddleware.protect, AuthMiddleware.restrictTo(UserRole.ADMIN), userController.blockAccount)
    router.post("/register", uploadSingleFile("photoperfil"), userController.createUser);
    router.get("/", userController.findAllUsers);
    router.get("/:id", userController.findOneUser);
    router.patch("/:id", userController.updateUser);
    router.delete("/:id", userController.deleteUser);
    router.post("/login", userController.login);
    router.get("/validate-email/:token", userController.validateAccount)
   


    return router;
  }
}
