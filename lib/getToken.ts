import { cookies } from "next/headers";

export async function getTokenFromCookies() {
  const cookieStore = await cookies();   // 👈 must await
  const token = cookieStore.get("token");

  return token?.value || null;
}