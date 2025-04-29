import { NextFunction, Request, Response } from "express";

export class AuthMiddleware{
    static async protect(req:Request, res:Response, next:NextFunction){
        const authorization = req.header("Authorization")
    }
}