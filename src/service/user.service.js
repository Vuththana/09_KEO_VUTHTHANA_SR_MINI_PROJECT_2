import headerToken from "@/lib/headerToken";

export async function getCurrentUser() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/users/me`, {
        headers:  await headerToken() 
    });
    const currentUser = await res.json();

    return currentUser;
}