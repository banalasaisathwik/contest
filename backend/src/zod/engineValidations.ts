import z from 'zod'

export const createOrderSchema = z.discriminatedUnion("type",[
     z.object({
    type: z.literal("limit"),
    userId :z.string(),
    side: z.enum(["long", "short"]),
    symbol: z.string().trim(),
    price: z.number().positive("providepositive price"),
    quantity: z.number().positive("providepositive price"),
    leverage: z.number().positive("providepositive price"),
    postOnly : z.boolean(),

  }),
  z.object({
    type: z.literal("market"),
    userId : z.string(),
    side: z.enum(["long", "short"]),
    symbol: z.string().trim(),
    price: z.null().optional(),
    quantity: z.number().positive("providepositive price"),
    leverage: z.number().positive("providepositive price"),
    postOnly : z.boolean(),
    clientOrderId : z.string().optional()
  }),
])

export const resetPayload = z.object({
  userId : z.string()
})

export const createUserSchema = z.object({
  userId : z.string(),
  initialBalance : z.number()
})