import { Router } from "express";
import { createOrder, createUser, getBalance, reset } from "../controller/engineController";

export const engineRoutes = Router()

engineRoutes.post("/api/reset",reset)
engineRoutes.post("/api/users",createUser)
engineRoutes.post("/create-order",createOrder)
engineRoutes.get("api/users/:userId/balance",getBalance)