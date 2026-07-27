import React from "react";
import StaffPage from "@/components/School/StaffPage";
import { getTokenFromCookies } from "@/lib/getToken";
import { redirect } from "next/navigation";

export default async function Page() {
  const token = await getTokenFromCookies();
  if (!token) {
    redirect("/auth/login");
  }

  return (
    <div>
      <StaffPage />
    </div>
  );
}
