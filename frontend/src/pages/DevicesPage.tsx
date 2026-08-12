import { useEffect, useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest, ApiError } from "../api/client";
import AIDescriptionAssistant from "../components/AIDescriptionAssistant";

interface Device {
  device_id: number;
  customer_id: number;
  customer_name?: string;
  device_type: string;
  brand: string;
  model: string;
  serial_number: string;
  issue_description: string;
}

interface CustomerOption {
  customer_id: number;
  full_name: string;
}

const emptyForm = {
  customer_id: "", device_type: "", brand: "", model: "", serial_number: "", issue_description: ""
};

export default function DevicesPage() {
  const { token } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
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
      const [deviceData, customerData] = await Promise.all([
        apiRequest<Device[]>("/devices", { token }),
        apiRequest<CustomerOption[]>("/customers", { token })
      ]);
      setDevices(deviceData);
      setCustomers(customerData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load devices");
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
    const body = { ...form, customer_id: Number(form.customer_id) };
    try {
      if (editingId !== null) {
        await apiRequest(`/devices/${editingId}`, { method: "PUT", body, token });
        setSuccessMessage("Device updated");
      } else {
        await apiRequest("/devices", { method: "POST", body, token });
        setSuccessMessage("Device created");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    }
  }

  function startEdit(d: Device) {
    setEditingId(d.device_id);
    setForm({
      customer_id: String(d.customer_id), device_type: d.device_type, brand: d.brand || "",
      model: d.model || "", serial_number: d.serial_number || "", issue_description: d.issue_description || ""
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this device?")) return;
    setError(null);
    try {
      await apiRequest(`/devices/${id}`, { method: "DELETE", token });
      setSuccessMessage("Device deleted");
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <h1>Devices</h1>
      {error && <div className="error-banner">{error}</div>}
      {successMessage && <div className="success-banner">{successMessage}</div>}

      <div className="card">
        <h2>{editingId !== null ? `Edit device #${editingId}` : "Add a device"}</h2>
        <form onSubmit={handleSubmit}>
          <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required>
            <option value="">-- Select customer --</option>
            {customers.map((c) => (
              <option key={c.customer_id} value={c.customer_id}>{c.full_name}</option>
            ))}
          </select>
          <input placeholder="Device type (Laptop, Phone...)" value={form.device_type}
            onChange={(e) => setForm({ ...form, device_type: e.target.value })} required />
          <input placeholder="Brand" value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <input placeholder="Model" value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })} />
          <input placeholder="Serial number" value={form.serial_number}
            onChange={(e) => setForm({ ...form, serial_number: e.target.value })} />
          <textarea placeholder="Issue description" value={form.issue_description}
            onChange={(e) => setForm({ ...form, issue_description: e.target.value })} style={{ width: "100%" }} />
          <button type="submit">{editingId !== null ? "Save changes" : "Create"}</button>
          {editingId !== null && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
        </form>

        <AIDescriptionAssistant onApply={(text) => setForm({ ...form, issue_description: text })} />
      </div>

      <div className="card">
        {loading ? <p>Loading...</p> : (
          <table>
            <thead>
              <tr><th>ID</th><th>Customer</th><th>Type</th><th>Brand/Model</th><th>Serial</th><th>Issue</th><th></th></tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.device_id}>
                  <td>{d.device_id}</td>
                  <td>{d.customer_name || d.customer_id}</td>
                  <td>{d.device_type}</td>
                  <td>{d.brand} {d.model}</td>
                  <td>{d.serial_number}</td>
                  <td>{d.issue_description}</td>
                  <td>
                    <button className="secondary" onClick={() => startEdit(d)}>Edit</button>{" "}
                    <button className="danger" onClick={() => handleDelete(d.device_id)}>Delete</button>
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
