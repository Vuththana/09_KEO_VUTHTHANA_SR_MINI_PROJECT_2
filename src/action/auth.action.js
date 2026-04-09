"use server";

import { signIn, signOut } from "@/auth";
import { registerService } from "@/service/auth.service";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * LOGIN ACTION
 */
export async function loginAction(data) {
    try {
        await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirectTo: "/",
        });
    } catch (err) {
        if (isRedirectError(err)) throw err;
        return { error: "Invalid email or password" };
    }
}

/**
 * REGISTER ACTION
 */
export async function registerAction(data) {
    try {
        const res = await registerService(data);

        if (res?.error) {
            return { error: res.error };
        }

    } catch (err) {
        if (isRedirectError(err)) throw err;

        console.error("Register Action Error:", err);
        return { error: "An unexpected error occurred during registration." };
    }
    redirect("/login");
}

/**
 * LOGOUT ACTION
 */
export async function logOutAction() {
    await signOut({ redirectTo: "/login" });
}