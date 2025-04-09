import { Router } from "express";
import { PostRoutes } from "./post/router";
import { UserRoutes } from "./user/user.routes";

export class AppRoutes{
    //cuando hay metodoos estaticos no necesitams instanciar
    static get routes():Router{
        const router = Router()
        router.use(("/api/post"),PostRoutes.routes)
        router.use("/api/user", UserRoutes.routes);
        return router
    }
}