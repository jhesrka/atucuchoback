import { regularExp } from "../../../config";

// src/domain/dtos/user/create-user.dto.ts
export class LoginUserDTO {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDTO?] {
    const { email, password } = object;

    // Validación de email
    if (!email) return ["El correo electrónico es obligatorio"];
    if (!regularExp.email.test(email))
      return ["El formato del correo electrónico no es válido"];

    // Validación de contraseña
    if (!password) return ["La contraseña es obligatoria"];
    if (!regularExp.password.test(password)) {
      return [
        "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo",
      ];
    }

    return [undefined, new LoginUserDTO(email, password)];
  }
}
