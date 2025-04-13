// src/presentation/services/user.service.ts
import { User } from "../../data"; // Modelo de usuario
import {
  CreateUserDTO,
  UpdateUserDTO,
  CustomError,
  LoginUserDTO,
} from "../../domain"; // DTOs
import { getIO } from "../../config/socket"; // Para emitir eventos a través de socket.io
import { encriptAdapter, JwtAdapter } from "../../config";

export class UserService {
  constructor() {}
  
  async login(credentials: LoginUserDTO) {
    //buscar el usuario
    const user = await this.findUserByEmail(credentials.email);
    //validar la contraseña
    const isMatching = encriptAdapter.compare(
      credentials.password,
      user.password
    );
    if (!isMatching)
      throw CustomError.unAuthorized("Usuario o contraseña invalidos");
    //generar un jwt
    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServer("Error generando Jwt");
    // enviar la data
    console.log(token, user);
    return{
      token:token,
      user:{
        id:user.id,
        name:user.name,
      }
    }
  }
  async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
        status: true,
      },
    });
    if (!user) {
      throw CustomError.notFound(`Usuario: ${email} no encontrado`);
    }
    return user;
  }
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
    // Encriptar la contraseña

    const user = new User();

    user.name = userData.name.toLowerCase().trim();
    user.surname = userData.surname.toLowerCase().trim();
    user.email = userData.email.toLowerCase().trim();
    user.password = userData.password;
    user.birthday = new Date(userData.birthday); // Convertir a tipo Date
    user.whatsapp = userData.whatsapp.trim();
    user.photoperfil = userData.photoperfil?.trim() || "";

    try {
      const newUser = await user.save();
      getIO().emit("userChanged", newUser); // Emitir evento
      return {
        id: newUser.id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        birthday: newUser.birthday.toISOString(),
        whatsapp: newUser.whatsapp,
        photoperfil: newUser.photoperfil,
        create_at: newUser.created_at,
        update_at: newUser.updated_at,
        is_verified: newUser.is_verified,
        status: newUser.status,
      };
    } catch (error: any) {
      console.log(error);
      if (error.code === "23505") {
        throw CustomError.badRequest(
          `Correo:${userData.email} o Whatsapp:${userData.whatsapp} ya existen`
        );
      }

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
    if (userData.password) user.password = userData.password;
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
    user.status = false; // Cambiar a estado inactivo

    try {
      await user.save(); // Usamos `save` en vez de `remove` porque no estamos eliminando el registro, solo marcándolo
      getIO().emit("userChanged", user); // Emitir evento
    } catch (error) {
      throw CustomError.internalServer("Error eliminando el Usuario");
    }
  }
}
