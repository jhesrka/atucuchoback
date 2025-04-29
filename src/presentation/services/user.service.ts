// src/presentation/services/user.service.ts
import { Status, User } from "../../data"; // Modelo de usuario
import {
  CreateUserDTO,
  UpdateUserDTO,
  CustomError,
  LoginUserDTO,
} from "../../domain"; // DTOs
import { getIO } from "../../config/socket"; // Para emitir eventos a través de socket.io
import { encriptAdapter, envs, JwtAdapter } from "../../config";
import { EmailService } from "./email.service";

export class UserService {
  constructor(private readonly emailService: EmailService) {}

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
    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }
  async findUserByEmail(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
        status: Status.ACTIVE,
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
      await this.sendEmailValidationLink(newUser.email);
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
    user.status = Status.DELETED; // Cambiar a estado inactivo

    try {
      await user.save(); // Usamos `save` en vez de `remove` porque no estamos eliminando el registro, solo marcándolo
      getIO().emit("userChanged", user); // Emitir evento
    } catch (error) {
      throw CustomError.internalServer("Error eliminando el Usuario");
    }
  }

  public sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email }, "3000s");
    if (!token)
      throw CustomError.internalServer(
        "Error generando token para enviar email"
      );
    const link = `http://${envs.WEBSERVICE_URL}/api/user/validate-email/${token}`;
    const html = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://tusitio.com/logo-atucucho.png" alt="Atucucho Shop" style="max-width: 150px;" />
    </div>
    <h2 style="color: #2c3e50; text-align: center;">Activa tu cuenta en Atucucho Shop</h2>
    <p>Hola,</p>
    <p>Este correo ha sido enviado para que puedas <strong>activar tu cuenta en Atucucho Shop</strong>. Para continuar, por favor haz clic en el botón a continuación:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Activar cuenta</a>
    </div>
    <p><strong>Importante:</strong> este enlace es válido solo por <strong>5 minutos</strong>. Si expira, deberás solicitar uno nuevo.</p>
    <p>Si tú no solicitaste esta verificación, puedes ignorar este mensaje de forma segura.</p>
    <hr style="margin: 30px 0;" />
    <p style="font-size: 12px; color: #999; text-align: center;">Correo enviado a: ${email}</p>
    <p style="font-size: 12px; color: #999; text-align: center;">Gracias por unirte a Atucucho Shop.</p>
  </div>
`;

    const isSent = this.emailService.sendEmail({
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    });
    if (!isSent) throw CustomError.internalServer("Error enviando el correo");
    return true;
  };

  validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.badRequest("Token no validado");
    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await User.findOne({ where: { email: email } });
    if (!user) throw CustomError.internalServer("Correo no existe");
    user.status = Status.ACTIVE;
    try {
      await user.save();
      return {
        message:"activado"
      }
    } catch (error) {
      throw CustomError.internalServer("Something went very wrong");
    }
  };
}
