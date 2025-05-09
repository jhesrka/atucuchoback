import { Useradmin } from "../../data";
import { CustomError } from "../../domain";
import { CreateUseradminDTO } from "../../domain/dtos/useradmin/create-useradmin.dto";

export class UseradminService {
  async createUseradmin(useradminData: CreateUseradminDTO) {
    const useradmin = new Useradmin();
    useradmin.username = useradminData.username.toLocaleLowerCase().trim();
    useradmin.name = useradminData.name.toLocaleLowerCase().trim();
    useradmin.surname = useradminData.surname.toLocaleLowerCase().trim();
    useradmin.email = useradminData.email.toLocaleLowerCase().trim();
    useradmin.password = useradminData.password;
    useradmin.whatsapp = useradminData.whatsapp.trim();

    try {
      const newUseradmin = await useradmin.save();
      return {
        id: newUseradmin.id,
        username: newUseradmin.username,
        name: newUseradmin.name,
        surname: newUseradmin.surname,
        email: newUseradmin.email,
        whatsapp: newUseradmin.whatsapp,
        create_at: newUseradmin.created_at,
        update_at: newUseradmin.updated_at,
        rol: newUseradmin.rol,
        status: newUseradmin.status,
      };
    } catch (error: any) {
      if (error.code === "23505") {
        throw CustomError.badRequest(
          `Correo:${useradminData.email} o Whatsapp:${useradminData.whatsapp} ya existen`
        );
      }
      throw CustomError.internalServer("Error creando el Usuario");
    }
  }

  async findAllUsersadmin() {
    try {
      const usersadmin = await Useradmin.find();
      return usersadmin.map((useradmin) => ({
        id: useradmin.id,
        username: useradmin.username,
        name: useradmin.name,
        surname: useradmin.surname,
        email: useradmin.email,
        whatsapp: useradmin.whatsapp,
        created_at: useradmin.created_at,
        update_at: useradmin.updated_at,
        rol: useradmin.rol,
        status: useradmin.status,
      }));
    } catch (error) {
      throw CustomError.internalServer(
        "Error obteniendo usuarios administradores"
      );
    }
  }
}
