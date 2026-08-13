import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest, ApiError } from "../api/client";

interface Customer {
  customer_id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

const emptyForm = { full_name: "", email: "", phone: "", address: "" };

export default function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Success banner auto-dismisses so it doesn't linger and clutter the page.
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  async function loadCustomers() {
    try {
      setError(null);
      const data = await apiRequest<Customer[]>("/customers", { token });
      setCustomers(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editingId !== null) {
        await apiRequest(`/customers/${editingId}`, { method: "PUT", body: form, token });
        setSuccessMessage("Customer updated");
      } else {
        await apiRequest("/customers", { method: "POST", body: form, token });
        setSuccessMessage("Customer created");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadCustomers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    }
  }

  function startEdit(c: Customer) {
    setEditingId(c.customer_id);
    setForm({ full_name: c.full_name, email: c.email, phone: c.phone || "", address: c.address || "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this customer?")) return;
    setError(null);
    try {
      await apiRequest(`/customers/${id}`, { method: "DELETE", token });
      setSuccessMessage("Customer deleted");
      await loadCustomers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <h1>Customers</h1>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}

      <div className="card">
        <h2>{editingId !== null ? `Edit customer #${editingId}` : "Add a customer"}</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Full name" value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <input placeholder="Email" type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Address" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button type="submit">{editingId !== null ? "Save changes" : "Create"}</button>
          {editingId !== null && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
        </form>
      </div>

      <div className="card">
        {loading ? <p>Loading...</p> : (
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th></th></tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.customer_id}>
                  <td>{c.customer_id}</td>
                  <td>{c.full_name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.address}</td>
                  <td>
                    <button className="secondary" onClick={() => startEdit(c)}>Edit</button>{" "}
                    <button className="danger" onClick={() => handleDelete(c.customer_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
