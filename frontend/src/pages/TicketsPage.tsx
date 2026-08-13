import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest, ApiError } from "../api/client";
import AIDescriptionAssistant from "../components/AIDescriptionAssistant";

interface Ticket {
  ticket_id: number;
  customer_id: number;
  device_id: number;
  customer_name?: string;
  device_type?: string;
  brand?: string;
  model?: string;
  issue: string;
  status: string;
  priority: string;
  estimated_cost: number;
}

interface CustomerOption { customer_id: number; full_name: string; }
interface DeviceOption { device_id: number; customer_id: number; device_type: string; brand: string; model: string; }

const emptyForm = {
  customer_id: "", device_id: "", issue: "", status: "Pending", priority: "Medium", estimated_cost: ""
};

const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [devices, setDevices] = useState<DeviceOption[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  async function loadAll() {
    try {
      setError(null);
      const [ticketData, customerData, deviceData] = await Promise.all([
        apiRequest<Ticket[]>("/tickets", { token }),
        apiRequest<CustomerOption[]>("/customers", { token }),
        apiRequest<DeviceOption[]>("/devices", { token })
      ]);
      setTickets(ticketData);
      setCustomers(customerData);
      setDevices(deviceData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const body = {
      ...form,
      customer_id: Number(form.customer_id),
      device_id: Number(form.device_id),
      estimated_cost: form.estimated_cost ? Number(form.estimated_cost) : 0
    };
    try {
      if (editingId !== null) {
        await apiRequest(`/tickets/${editingId}`, { method: "PUT", body, token });
        setSuccessMessage("Ticket updated");
      } else {
        await apiRequest("/tickets", { method: "POST", body, token });
        setSuccessMessage("Ticket created");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    }
  }

  function startEdit(t: Ticket) {
    setEditingId(t.ticket_id);
    setForm({
      customer_id: String(t.customer_id), device_id: String(t.device_id), issue: t.issue,
      status: t.status, priority: t.priority, estimated_cost: String(t.estimated_cost)
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this ticket?")) return;
    setError(null);
    try {
      await apiRequest(`/tickets/${id}`, { method: "DELETE", token });
      setSuccessMessage("Ticket deleted");
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  const filteredDevices = devices.filter((d) => String(d.customer_id) === form.customer_id);

  return (
    <div>
      <h1>Repair Tickets</h1>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}

      <div className="card">
        <h2>{editingId !== null ? `Edit ticket #${editingId}` : "Add a ticket"}</h2>
        <form onSubmit={handleSubmit}>
          <select value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value, device_id: "" })} required>
            <option value="">-- Customer --</option>
            {customers.map((c) => <option key={c.customer_id} value={c.customer_id}>{c.full_name}</option>)}
          </select>
          <select value={form.device_id} onChange={(e) => setForm({ ...form, device_id: e.target.value })} required>
            <option value="">-- Device --</option>
            {filteredDevices.map((d) => (
              <option key={d.device_id} value={d.device_id}>{d.device_type} ({d.brand} {d.model})</option>
            ))}
          </select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input type="number" step="0.01" placeholder="Estimated cost" value={form.estimated_cost}
            onChange={(e) => setForm({ ...form, estimated_cost: e.target.value })} />
          <textarea placeholder="Issue" value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })} style={{ width: "100%" }} required />
          <button type="submit">{editingId !== null ? "Save changes" : "Create"}</button>
          {editingId !== null && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
        </form>

        <AIDescriptionAssistant onApply={(text) => setForm({ ...form, issue: text })} />
      </div>

      <div className="card">
        {loading ? <p>Loading...</p> : (
          <table>
            <thead>
              <tr><th>ID</th><th>Customer</th><th>Device</th><th>Issue</th><th>Status</th><th>Priority</th><th>Cost</th><th></th></tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.ticket_id}>
                  <td>{t.ticket_id}</td>
                  <td>{t.customer_name || t.customer_id}</td>
                  <td>{t.device_type ? `${t.device_type} (${t.brand} ${t.model})` : t.device_id}</td>
                  <td>{t.issue}</td>
                  <td>{t.status}</td>
                  <td>{t.priority}</td>
                  <td>${Number(t.estimated_cost).toFixed(2)}</td>
                  <td>
                    <button className="secondary" onClick={() => startEdit(t)}>Edit</button>{" "}
                    <button className="danger" onClick={() => handleDelete(t.ticket_id)}>Delete</button>
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
