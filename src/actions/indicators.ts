import { defineAction } from "astro:actions";
import { z } from "zod";

export const createIndicator = defineAction({
    input: z.object({}),
    async handler(input, cotext){

    } 
})