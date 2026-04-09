import { auth } from "../auth";

export default async function headerToken() {
  const session = await auth();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.user?.payload.token}`,
  };
}
