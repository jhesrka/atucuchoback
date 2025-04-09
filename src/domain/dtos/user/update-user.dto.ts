// src/domain/dtos/user/update-user.dto.ts
export class UpdateUserDTO {
    constructor(
      public readonly name?: string,
      public readonly surname?: string,
      public readonly email?: string,
      public readonly password?: string,
      public readonly birthday?: string, // Fecha como string
      public readonly whatsapp?: string,
      public readonly photoperfil?: string // Es opcional
    ) {}
  
    static create(object: { [key: string]: any }): [string?, UpdateUserDTO?] {
      const { name, surname, email, password, birthday, whatsapp, photoperfil } = object;
  
      if (name === undefined && surname === undefined && email === undefined && password === undefined && birthday === undefined && whatsapp === undefined && photoperfil === undefined) {
        return ["No se proporcionaron datos para actualizar"];
      }
  
      return [undefined, new UpdateUserDTO(name, surname, email, password, birthday, whatsapp, photoperfil)];
    }
  }
  