import { FormEvent } from "react";
import { Product } from "./api";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => void;
  initial: Product | null;
  onCancel: (() => void) | null;
}

export default function ProductForm({ onSubmit, initial, onCancel }: ProductFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const cost = Number(formData.get("cost"));

    if (!name || !cost) return;

    onSubmit({ name, cost });
    if (!initial) {
      e.currentTarget.reset();
    }
  }

  return (
    <form key={initial?.id || "new"} onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" defaultValue={initial?.name || ""} required />
      </label>
      <label>
        Cost
        <input name="cost" type="number" defaultValue={initial?.cost || ""} required />
      </label>
      <button type="submit">{initial ? "Save" : "Add"}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}
