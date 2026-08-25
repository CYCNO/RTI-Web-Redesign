export const AUTH_STORAGE_KEY = "rti_auth_user";

export function loginUser(user: string, pass: string): boolean {
  const trimmedUser = user.trim();
  const trimmedPass = pass.trim();

  if (
    (trimmedUser === "user123" || trimmedUser === "user123@gmail.com") &&
    trimmedPass === "password"
  ) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, "user123");
      document.cookie = `${AUTH_STORAGE_KEY}=user123; path=/; max-age=86400; SameSite=Lax`;
    }
    return true;
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
  return localStorage.getItem(AUTH_STORAGE_KEY) === "user123";
}
