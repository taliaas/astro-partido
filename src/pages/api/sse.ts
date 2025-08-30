import type { APIRoute } from "astro";
import { API_URL } from "astro:env/client";

function sleep(milli: number) {
    return new Promise(res=>setTimeout(res,milli))
}

export const GET: APIRoute = (ctx) => {

    const connect = async ()=> {
        const res  = await fetch(API_URL + "/sse", { headers: ctx.request.headers })
        res.stream
        return res
    }

    return connect()
}