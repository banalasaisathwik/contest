import type { EngineResponse } from "../types/engine";

interface PendingResponse {
  resolve: (response: EngineResponse) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
}

const pendingResponses = new Map<string, PendingResponse>();

export function waitloopPromise(correlationId:string,timeoutMs:number):Promise<EngineResponse>{
    return new Promise((resolve,reject)=>{
        const timeout = setTimeout(() => {
      pendingResponses.delete(correlationId);
      reject(new Error("Engine response timed out"));
    }, timeoutMs);

     pendingResponses.set(correlationId, {
      resolve,
      reject,
      timeout,
    });

    })
}

export function resolvePendingResponse(response :EngineResponse ){
   const pendingRes = pendingResponses.get(response.correlationId);
  if (!pendingRes) return;

  clearTimeout(pendingRes.timeout);
  pendingRes.resolve(response);
  pendingResponses.delete(response.correlationId);
  
}