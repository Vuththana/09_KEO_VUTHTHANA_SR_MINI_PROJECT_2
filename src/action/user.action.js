import { getCurrentUser } from "@/service/user.service";

/*
 * Get current user
 */
export async function getCurrentUserAction() {
    const currentUser = await getCurrentUser();

    return currentUser;
}