export interface Product {
  id: number;
  name: string;
  cost: number;
}

export interface Member {
  id: number;
  name: string;
  surname: string;
}

export interface HealthResponse {
  status: "ok";
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/v1/health`);
  if (!res.ok) {
    throw new Error(`Health check failed with HTTP ${res.status}`);
  }

  const data: unknown = await res.json();
  if (typeof data !== "object" || data === null || !("status" in data) || data.status !== "ok") {
    throw new Error("Health check returned an invalid response");
  }

  return { status: data.status };
}

export async function getMembers(): Promise<Member[]> {
  const res = await fetch(`${API_URL}/members`);
  if (!res.ok) {
    throw new Error(`Failed to load members: HTTP ${res.status}`);
  }

  const data: unknown = await res.json();
  if (
    !Array.isArray(data) ||
    !data.every(
      (member: unknown) =>
        typeof member === "object" &&
        member !== null &&
        "id" in member &&
        typeof member.id === "number" &&
        "name" in member &&
        typeof member.name === "string" &&
        "surname" in member &&
        typeof member.surname === "string"
    )
  ) {
    throw new Error("Members API returned an invalid response");
  }

  return data;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/product`);
  return res.json();
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(`${API_URL}/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
}

export async function updateProduct(id: number, product: Omit<Product, "id">): Promise<Product> {
  const res = await fetch(`${API_URL}/product/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (res.status === 404) {
    const err = await res.json();
    throw new Error(err.message);
  }
  return res.json();
}

export async function deleteProduct(id: number): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/product/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
