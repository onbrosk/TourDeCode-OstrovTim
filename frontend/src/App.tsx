import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, Product } from "./api";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState("");

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error("Failed to load products:", e);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/v1/health`)
    .then((r) => r.json())
    .then((data) => setStatus(String(data.status).toUpperCase()))
    .catch((e) => console.error("Health check failed:", e));
}, []);

  async function handleCreate(product: Omit<Product, "id">) {
    await createProduct(product);
    loadProducts();
  }

  async function handleUpdate(id: number, product: Omit<Product, "id">) {
    await updateProduct(id, product);
    setEditingProduct(null);
    loadProducts();
  }

  async function handleDelete(id: number) {
    await deleteProduct(id);
    loadProducts();
  }

  return (
    <div>
      <h1>School buffet</h1>
      <p>Status: {status}</p>

      <ProductForm
        onSubmit={editingProduct ? (p) => handleUpdate(editingProduct.id, p) : handleCreate}
        initial={editingProduct}
        onCancel={editingProduct ? () => setEditingProduct(null) : null}
      />

      <ProductTable
        products={products}
        onEdit={setEditingProduct}
        onDelete={handleDelete}
      />
    </div>
  );
}
