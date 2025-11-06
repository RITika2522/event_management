import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    vendorType: [],
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVendorTypeChange = (value) => {
    if (form.vendorType.includes(value)) {
      // remove if already selected
      setForm({
        ...form,
        vendorType: form.vendorType.filter((type) => type !== value),
      });
    } else {
      // add new selected type
      setForm({ ...form, vendorType: [...form.vendorType, value] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form, { withCredentials: true });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 mb-3 w-full rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-3 w-full rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <select
          className="border p-2 mb-3 w-full rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value, vendorType: [] })}
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>

        {form.role === "vendor" && (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Select Vendor Types</label>
            <div className="flex flex-col space-y-2 border p-3 rounded">
              {["Catering", "Florist", "Decoration", "Lighting", "Others"].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.vendorType.includes(type)}
                    onChange={() => handleVendorTypeChange(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600">
          Register
        </button>

        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
