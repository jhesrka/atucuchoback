  // src/presentation/user/user.controller.ts
  import { Request, Response } from "express";
  import { UserService } from "../services/user.service";
  import { CreateUserDTO, UpdateUserDTO, CustomError, LoginUserDTO } from "../../domain";

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
      const photoUrl = req.file ? (req.file as any).location : undefined;

      const [error, createUserDto] = CreateUserDTO.create(req.body);
      if (error) return this.handleError(error, res)

      const updatedCreateUserDto = {
        ...createUserDto!,
        photoperfil: photoUrl ?? createUserDto!.photoperfil,
      };

      this.userService
        .createUser(updatedCreateUserDto)
        .then((data) => res.status(201).json(data))
        .catch((error) => this.handleError(error, res));
    };

    findAllUsers = (req: Request, res: Response) => {
      this.userService
        .findAllUsers()
        .then((data) => res.status(200).json(data))
        .catch((error) => this.handleError(error, res));
    };

    findOneUser = (req: Request, res: Response) => {
      const { id } = req.params;
      this.userService
        .findOneUser(id)
        .then((data) => res.status(200).json(data))
        .catch((error) => this.handleError(error, res));
    };

    updateUser = (req: Request, res: Response) => {
      const { id } = req.params;
      const [error, updateUserDto] = UpdateUserDTO.create(req.body);
      if (error) return res.status(422).json({ message: error });

      this.userService
        .updateUser(id, updateUserDto!)
        .then((data) => res.status(200).json(data))
        .catch((error) => this.handleError(error, res));
    };

    deleteUser = (req: Request, res: Response) => {
      const { id } = req.params;
      this.userService
        .deleteUser(id)
        .then(() => res.status(204).json(null))
        .catch((error) => this.handleError(error, res));
    };
    login = (req:Request, res:Response)=>{
      const[error,loginUserDto]=LoginUserDTO.create(req.body)
      if(error)return res.status(422).json({message:error})
      this.userService.login(loginUserDto!)
        .then((data) => res.status(200).json(data))
        .catch((error) => this.handleError(error, res));
    };
    validateAccount=  (req:Request, res:Response)=>{
      const {token}=req.params
      this.userService.validateEmail(token)
        .then((data) => res.status(200).json(data))
        .catch((error) => this.handleError(error, res));
    };
  }
