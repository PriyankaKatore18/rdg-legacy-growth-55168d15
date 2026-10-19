export type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export type CustomerCartItem = {
  cartItemId: number;
  productId: number;
  quantity: number;
  name: string;
  slug: string;
  category?: string | null;
  subtitle?: string | null;
  description?: string | null;
  highlights: string[];
  price?: number | null;
  imageUrl?: string | null;
};

async function customerApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { credentials: "include", ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    const error = new Error(payload.error || "Request failed.");
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return payload.data as T;
}

export async function getCustomerMe(): Promise<Customer | null> {
  try {
    const data = await customerApi<{ customer: Customer }>("/api/customer/auth/me");
    return data.customer;
  } catch {
    return null;
  }
}

export async function loginCustomer(email: string, password: string) {
  const data = await customerApi<{ customer: Customer }>("/api/customer/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return data.customer;
}

export async function registerCustomer(payload: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const data = await customerApi<{ customer: Customer }>("/api/customer/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return data.customer;
}

export async function logoutCustomer() {
  await customerApi("/api/customer/auth/logout", { method: "POST" });
}

export async function getCustomerCart() {
  return customerApi<CustomerCartItem[]>("/api/customer/cart");
}

export async function addToCustomerCart(productId: number, quantity = 1) {
  return customerApi<CustomerCartItem[]>("/api/customer/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCustomerCart(productId: number, quantity: number) {
  return customerApi<CustomerCartItem[]>(`/api/customer/cart/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCustomerCart(productId: number) {
  return customerApi<CustomerCartItem[]>(`/api/customer/cart/${productId}`, {
    method: "DELETE",
  });
}
