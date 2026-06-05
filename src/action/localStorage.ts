const AUTH_KEY = "auth";

export interface AuthData {
  token: string;
  username: string;
  email?: string;
}

export function getAuth(): AuthData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthData;
  } catch {
    return null;
  }
}

export function setAuth(data: AuthData): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}
