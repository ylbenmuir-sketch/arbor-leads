"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null);
  return (
    <form action={action} className="mt-8 rounded-lg border-2 border-line bg-raised p-5 sm:p-8">
      <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-cream">
        Password
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="w-full min-h-14 rounded-md border-2 border-sage/50 bg-bg px-4 py-3.5 text-base text-cream focus:border-sage focus:outline-none"
      />
      {state?.error && (
        <p role="alert" className="mt-4 text-base font-semibold text-cream">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-forest mt-5 w-full disabled:cursor-wait disabled:opacity-70">
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
