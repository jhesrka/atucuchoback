import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../config";
import { Status, User, UserRole } from "../data";

export class AuthMiddleware {
  static async protect(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    if (!authorization)
      return res.status(401).json({ message: "No Token provided" });
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "Invalid token" });
    const token = authorization.split(" ").at(1) || "";
    try {
      const payload = (await JwtAdapter.validateToken(token)) as { id: string };
      if (!payload) return res.status(401).json({ message: "Invalid Token" });

      const user = await User.findOne({
        where: {
          id: payload.id,
          status: Status.ACTIVE,
        },
      });
      if (!user) return res.status(401).json({ message: "invalid user" });
      req.body.sessionUser = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Interval Server Error" });
    }
  }
  static restrictTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.body.sessionUser.rol)) {
        return res
          .status(403)
          .json({ message: "No tienes acceso a esta ruta" });
      }
      next();
    };
  };

  
}
