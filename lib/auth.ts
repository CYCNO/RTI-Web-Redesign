export const AUTH_STORAGE_KEY = "rti_auth_user";

export async function loginUser(user: string, pass: string): Promise<boolean> {
  const trimmedUser = user.trim();
  const trimmedPass = pass.trim();

  // Primary: verify securely with server API route that has access to .env
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: trimmedUser, pass: trimmedPass }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, data.user || trimmedUser);
        document.cookie = `${AUTH_STORAGE_KEY}=${data.user || trimmedUser}; path=/; max-age=86400; SameSite=Lax`;
      }
      return true;
    }
  } catch (err) {
    console.error("Authentication API error:", err);
  }

  // Fallback: check if client-side env variables are present (NEXT_PUBLIC_ prefix or next.config.ts)
  const envUser = (
    process.env.NEXT_PUBLIC_LOGIN_USERNAME ||
    process.env.NEXT_PUBLIC_LOGIN_EMAIL ||
    process.env.NEXT_PUBLIC_GMAIL ||
    process.env.LOGIN_USERNAME ||
    ""
  ).trim();

  const envPass = (
    process.env.NEXT_PUBLIC_LOGIN_PASSWORD ||
    process.env.NEXT_PUBLIC_PASSWORD ||
    process.env.LOGIN_PASSWORD ||
    ""
  ).trim();

  if (envUser && envPass) {
    const isUserMatch =
      trimmedUser.toLowerCase() === envUser.toLowerCase() ||
      trimmedUser.toLowerCase() === `${envUser.toLowerCase()}@gmail.com` ||
      trimmedUser.toLowerCase().replace(/@gmail\.com$/, "") === envUser.toLowerCase().replace(/@gmail\.com$/, "");

    if (isUserMatch && trimmedPass === envPass) {
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, trimmedUser);
        document.cookie = `${AUTH_STORAGE_KEY}=${trimmedUser}; path=/; max-age=86400; SameSite=Lax`;
      }
      return true;
    }
  }

  return false;
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = `${AUTH_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function isUserAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return Boolean(stored && stored.trim().length > 0);
}
