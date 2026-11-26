"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_MAX_AGE, adminConfigured, passwordMatches, sessionValue } from "@/lib/server/admin";

export type LoginState = { error: string } | null;

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "ADMIN_PASSWORD isn't set in Vercel yet, so nobody can log in." };
  if (!passwordMatches(String(form.get("password") ?? ""))) {
    // Slow down anyone guessing.
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "That password isn't right." };
  }
  (await cookies()).set(ADMIN_COOKIE, sessionValue(Date.now() + ADMIN_MAX_AGE * 1000), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).set(ADMIN_COOKIE, "", { httpOnly: true, path: "/admin", maxAge: 0 });
  redirect("/admin");
}
