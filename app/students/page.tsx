import React from "react";
import StudentPage from "@/components/School/StudentPage";
import { getTokenFromCookies } from "@/lib/getToken";
import { redirect } from "next/navigation";

export default async function Page() {
  const token = await getTokenFromCookies();
  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div>
      <StudentPage />
    </div>
  );
}
