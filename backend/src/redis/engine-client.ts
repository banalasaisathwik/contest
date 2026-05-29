import { createClient } from "redis";
import type { EngineCommandType, EngineRequest, EngineResponse } from "../types/engine";
import { resolvePendingResponse, waitloopPromise } from "../store/pendingResponse";


const publisher = createClient({url : process.env.REDIS_URL}).on("error",()=> console.log("error with publisher"))
const subscriber = createClient({url : process.env.REDIS_URL}).on("error",()=> console.log("error with publisher"))

export async function connectRedis(){
    await Promise.all([publisher.connect(),subscriber.connect()])
}


export async function sendToEngine(type : EngineCommandType , payload : Record<string, unknown>) : Promise<EngineResponse>{
    const correlationId = crypto.randomUUID()
    const responsePromise = waitloopPromise(correlationId, 300000);

    const message: EngineRequest ={
        type,
        correlationId,
        payload,
        responseQueue: "backendQueue",
    }

    await publisher.lPush("backend-engine-queue",JSON.stringify(message))
    return responsePromise
}

export async function checkRespones(){
    for(;;){
        const payload = (await subscriber.sendCommand(["BRPOP", "backendQueue", "0"])) as [string, string] | null;
        if(!payload){
            continue
        }

        const [, element] = payload;

        try {
            const parsedResponse = JSON.parse(element)
            resolvePendingResponse(parsedResponse)

        } catch (error) {
            console.error("Invalid engine response", error);
        }
    }
}
