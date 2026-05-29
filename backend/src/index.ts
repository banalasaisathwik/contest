import express, { type NextFunction , type Request, type Response } from "express"
import cors from 'cors'
import { appRouter } from "./routes/appRoutes"
import { checkRespones, connectRedis } from "./redis/engine-client"

await connectRedis()
void checkRespones().catch(()=>console.log("error at checkesponse"))

const app = express()

app.use(cors())
app.use(express.json())

app.use(appRouter)

app.use(ErrorHandler)

function ErrorHandler(err : unknown,req:Request,res:Response,next:NextFunction){
    console.log(err)

    res.status(500).send({
        error : (err instanceof Error) ? err.message : "server error"
    })
}

app.listen(3000,()=>{
    console.log(`server started in port 3000`)
})