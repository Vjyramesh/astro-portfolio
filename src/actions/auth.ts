import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";

export const login =  defineAction({
    accept: 'form',
    input: z.object({
        email: z.email("Invalid email format").min(1, 'Email is required').max(255, "Email too long"),
        password: z.preprocess((v) => (v === null ? "" : v), z.string().trim().min(1, 'Password is required'))
    }),
    handler: async ({ email, password }, { locals }) => {
        if (email !== 'vjyramesh@gmail.com' || password !== '12345') {
            throw new ActionError({
                code: 'UNAUTHORIZED',
                message: 'Invalid Email or Password'
            })
        }
        await locals.session?.set("user", { email, role: "admin" });
        return { ok: true };
    }
});