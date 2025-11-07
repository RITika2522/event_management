import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    services: [],
  });
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const servicesList = [
    "Catering",
    "Decoration",
    "Photography",
    "Venue",
    "Entertainment",
    "Lighting",
    "Sound System",
    "Security",
    "Transportation",
    "Event Planning",
  ];

  const handleServiceChange = (service) => {
    setForm((prevForm) => {
      if (prevForm.services.includes(service)) {
        return {
          ...prevForm,
          services: prevForm.services.filter((s) => s !== service),
        };
      } else {
        return { ...prevForm, services: [...prevForm.services, service] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form, {
        withCredentials: true,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
      <div className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl w-96 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-wide">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-white text-sm mb-1">Role</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user" className="text-black">
                User
              </option>
              <option value="vendor" className="text-black">
                Vendor
              </option>
            </select>
          </div>

          {/* Vendor Services Dropdown */}
          {form.role === "vendor" && (
            <div className="mb-6 relative">
              <label className="block text-white text-sm mb-1">Select Services Offered</label>
              <div
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white cursor-pointer flex justify-between items-center"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="truncate">
                  {form.services.length > 0
                    ? form.services.join(", ")
                    : "Choose services..."}
                </span>
                <span className="text-white text-lg">
                  {showDropdown ? "▲" : "▼"}
                </span>
              </div>

              {showDropdown && (
                <div className="absolute z-10 mt-2 w-full max-h-40 overflow-y-auto bg-white/20 border border-white/30 rounded-lg backdrop-blur-md shadow-xl">
                  {servicesList.map((service) => (
                    <label
                      key={service}
                      className="flex items-center px-4 py-2 hover:bg-white/30 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.services.includes(service)}
                        onChange={() => handleServiceChange(service)}
                        className="mr-2"
                      />
                      <span className="text-white text-sm">{service}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-all duration-200"
          >
            Register
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-green-300 bg-white/10 py-2 rounded-lg">
            {message}
          </p>
        )}

        <p className="text-center text-white/80 mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-300 hover:text-white transition-colors underline"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
