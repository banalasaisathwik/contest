import type { Request, Response } from "express";
import {
  createOrderSchema,
  createUserSchema,
  resetPayload,
} from "../zod/engineValidations";
import { sendToEngine } from "../redis/engine-client";

export async function reset(req: Request, res: Response) {
  const parsedPayload = resetPayload.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new Error("issue with the structure in reset func in backend");
  }

  const { userId } = parsedPayload.data;
  const payload = {
    userId,
  };
  const engineResponse = await sendToEngine("reset", payload);

  if (engineResponse.ok) {
    res.send(engineResponse.data);
  } else {
    res.send(engineResponse.error);
  }
}

///////////
export async function createUser(req: Request, res: Response) {
  const validatedPayload = createUserSchema.safeParse(req.body);
  if (!validatedPayload.success) {
    throw new Error("issue with the structure in craeteUser func in backend");
  }

  const { userId,initialBalance } = validatedPayload.data;

  const payload = {
    userId,
    initialBalance
  };

  const responseEngine = await sendToEngine("createUser", payload);

  if (responseEngine.ok) {
    res.send(responseEngine.data);
  } else {
    res.send(responseEngine.error);
  }
}

///////

export async function getBalance(req: Request, res: Response) {
  const userId = req.params.userId;

  if (!userId) {
    throw new Error("userId path parameter is required");
  }

  const payload = {
    userId,
  };

  const engineResponse = await sendToEngine("getBalance", payload);

  if (engineResponse.ok) {
    res.send(engineResponse.data);
  } else {
    res.send(engineResponse.error);
  }
}


//////

export async function createOrder(req: Request, res: Response) {
  const vaidatePayload = createOrderSchema.safeParse(req.body);

  if (!vaidatePayload.success) {
    throw new Error("failed at structure parsing");
  }

  const { userId, type, side, symbol, quantity, leverage,postOnly } = vaidatePayload.data;
  const price = type === "market" ? null : vaidatePayload.data.price;

  const payload = {
    userId,
    type,
    side,
    symbol,
    price: type === "market" ? null : price,
    quantity,
    postOnly,
    leverage,
  };

  const engineResponse = await sendToEngine("create_order", payload);

  if (engineResponse.ok) {
    res.send(engineResponse.data);
  } else {
    throw new Error(engineResponse.error);
  }
}
