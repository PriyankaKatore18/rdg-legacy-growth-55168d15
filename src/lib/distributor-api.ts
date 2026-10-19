export type Distributor = {
  id: number;
  accountId: number;
  username: string;
  distributorCode: string;
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  sponsorCode?: string | null;
  status: string;
};

async function distributorApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { credentials: "include", ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    const error = new Error(payload.error || "Request failed.");
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return payload.data as T;
}

export async function getDistributorMe(): Promise<Distributor | null> {
  try {
    const data = await distributorApi<{ distributor: Distributor }>("/api/distributor/auth/me");
    return data.distributor;
  } catch {
    return null;
  }
}

export async function registerDistributor(payload: {
  name: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  sponsorCode?: string;
  password: string;
}) {
  const data = await distributorApi<{ distributor: Distributor }>(
    "/api/distributor/auth/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return data.distributor;
}

export async function loginDistributor(username: string, password: string) {
  const data = await distributorApi<{ distributor: Distributor }>("/api/distributor/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return data.distributor;
}

export async function logoutDistributor() {
  await distributorApi("/api/distributor/auth/logout", { method: "POST" });
}
