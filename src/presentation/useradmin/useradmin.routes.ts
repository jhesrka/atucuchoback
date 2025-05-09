import { Router } from "express";
import { UseradminController } from "./useradmin.controller";
import { UseradminService } from "../services/useradmin.service";

export class UseradminRoutes {
  static get routes(): Router {
    const router = Router();
    const useradminService=new UseradminService()
    const useradminController=new UseradminController(useradminService)
    //crear usuarios administrativos
    router.post("/register", useradminController.createUseradmin )
    //buscar todos los usuarios administrativos
    router.get("/",useradminController.findAllUsersadmin)
    return router;
  }
}
