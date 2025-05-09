import { Request, Response } from "express";
import { UseradminService } from "../services/useradmin.service";
import { CustomError } from "../../domain";
import { CreateUseradminDTO } from "../../domain/dtos/useradmin/create-useradmin.dto";

export class UseradminController {
  constructor(private readonly useradminService: UseradminService) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("Unhandled error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  };

  createUseradmin = (req:Request, res:Response) => {
    const [error, createUseradminDto]=CreateUseradminDTO.create(req.body)
    if (error) return this.handleError(error, res);
    this.useradminService
    .createUseradmin(createUseradminDto!)
    .then((data) => res.status(201).json(data))
    .catch((error) => this.handleError(error, res));
  };

  findAllUsersadmin = (req: Request, res: Response) => {
    this.useradminService
      .findAllUsersadmin()
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
