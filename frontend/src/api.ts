export interface Product {
  id: number;
  name: string;
  cost: number;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

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
