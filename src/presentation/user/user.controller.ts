// src/presentation/controllers/user.controller.ts
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO, CustomError } from "../../domain"; // Corregí las importaciones

export class UserController {
  constructor(private readonly userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error("Unhandled error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  };

  createUser = (req: Request, res: Response) => {
    console.log("Datos recibidos en el backend:", req.body);
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    const [error, createUserDto] = CreateUserDTO.create(req.body);
    if (error) {
      console.error("Error en la creación del DTO:", error);
      return res.status(422).json({ message: error });
    }
  
    if (!createUserDto) {
      console.error("Error: DTO no válido");
      return res.status(500).json({ message: "Error al crear el DTO de usuario" });
    }
  
    const updatedCreateUserDto = { 
      ...createUserDto, 
      photoperfil: photoUrl ?? createUserDto.photoperfil 
    };
  
    this.userService
      .createUser(updatedCreateUserDto)
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((error) => {
        console.error("Error en la creación del usuario:", error.message);
        return this.handleError(error, res);
      });
  };
  

  findAllUsers = (req: Request, res: Response) => {
    this.userService
      .findAllUsers()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        return this.handleError(error, res);
      });
  };

  findOneUser = (req: Request, res: Response) => {
    const { id } = req.params;
    this.userService
      .findOneUser(id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        return this.handleError(error, res);
      });
  };

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;

    const [error, updateUserDto] = UpdateUserDTO.create(req.body); // Usamos UpdateUserDTO en lugar de UpdateDTO
    if (error) return res.status(422).json({ message: error });

    this.userService
      .updateUser(id, updateUserDto!)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        return this.handleError(error, res);
      });
  };

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;
    this.userService
      .deleteUser(id)
      .then(() => {
        res.status(204).json(null);
      })
      .catch((error) => {
        return this.handleError(error, res);
      });
  };
}
