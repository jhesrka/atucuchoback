// src/domain/dtos/user/create-user.dto.ts
export class CreateUserDTO {
  constructor(
    public readonly name: string,
    public readonly surname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly birthday: string, // Fecha como string
    public readonly whatsapp: string,
    public photoperfil?: string | null // Eliminar 'readonly' para poder modificarlo
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateUserDTO?] {
    const { name, surname, email, password, birthday, whatsapp, photoperfil } = object;
    
    if (!name) return ["El nombre es necesario"];
    if (!surname) return ["El apellido es necesario"];
    if (!email) return ["El correo electrónico es necesario"];
    if (!password) return ["La contraseña es necesaria"];
    if (!birthday) return ["La fecha de nacimiento es necesaria"];
    if (!whatsapp) return ["El número de WhatsApp es necesario"];

    return [undefined, new CreateUserDTO(name, surname, email, password, birthday, whatsapp, photoperfil)];
  }
}
