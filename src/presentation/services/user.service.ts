// src/presentation/services/user.service.ts
import { User } from "../../data"; // Modelo de usuario
import { CreateUserDTO, UpdateUserDTO, CustomError } from "../../domain"; // DTOs
import bcrypt from "bcryptjs"; // Para encriptar contraseñas
import { getIO } from "../../config/socket"; // Para emitir eventos a través de socket.io

export class UserService {
  constructor() {}

  // Obtener todos los usuarios
  async findAllUsers() {
    try {
      return await User.find();
    } catch (error) {
      throw CustomError.internalServer("Error obteniendo los usuarios");
    }
  }

  // Obtener un usuario por ID
  async findOneUser(id: string) {
    const user = await User.findOne({ where: { id } });
    if (!user) throw CustomError.notFound("Usuario no encontrado");
    return user;
  }

  // Crear un nuevo usuario
  async createUser(userData: CreateUserDTO) {
    const { name, surname, email, password, birthday, whatsapp, photoperfil } = userData;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.name = name.toLowerCase().trim();
    user.surname = surname.toLowerCase().trim();
    user.email = email.toLowerCase().trim();
    user.password = hashedPassword;
    user.birthday = new Date(birthday); // Convertir a tipo Date
    user.whatsapp = whatsapp.trim();
    user.photoperfil = photoperfil?.trim() || "";

    try {
      const newUser = await user.save();
      getIO().emit("userChanged", newUser); // Emitir evento
      return newUser;
    } catch (error) {
      throw CustomError.internalServer("Error creando el Usuario");
    }
  }

  // Actualizar datos del usuario
  async updateUser(id: string, userData: UpdateUserDTO) {
    const user = await this.findOneUser(id);

    // Asignar los nuevos valores, solo los campos que se hayan proporcionado
    if (userData.name) user.name = userData.name.toLowerCase().trim();
    if (userData.surname) user.surname = userData.surname.toLowerCase().trim();
    if (userData.email) user.email = userData.email.toLowerCase().trim();
    if (userData.password) user.password = await bcrypt.hash(userData.password, 10);
    if (userData.birthday) user.birthday = new Date(userData.birthday); // Convertir a tipo Date
    if (userData.whatsapp) user.whatsapp = userData.whatsapp.trim();
    if (userData.photoperfil) user.photoperfil = userData.photoperfil.trim();

    try {
      const updatedUser = await user.save();
      getIO().emit("userChanged", updatedUser); // Emitir evento
      return updatedUser;
    } catch (error) {
      throw CustomError.internalServer("Error actualizando el Usuario");
    }
  }

  // Eliminar un usuario (marcar como inactivo)
  async deleteUser(id: string) {
    const user = await this.findOneUser(id);
    user.status = 'inactive'; // Cambiar a estado inactivo

    try {
      await user.save(); // Usamos `save` en vez de `remove` porque no estamos eliminando el registro, solo marcándolo
      getIO().emit("userChanged", user); // Emitir evento
    } catch (error) {
      throw CustomError.internalServer("Error eliminando el Usuario");
    }
  }
}
