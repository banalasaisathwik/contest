import { Router } from "express";
import { engineRoutes } from "./engineRoutes";


export const appRouter = Router() 

appRouter.use(engineRoutes)