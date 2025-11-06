import { useEffect, useState } from "react";
import axios from "axios";

export default function VendorDashboard() {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", price: "" });
    const [editId, setEditId] = useState(null);

    const fetchItems = async () => {
        const res = await axios.get("http://localhost:5000/api/items");
        setItems(res.data);
    };

    const fetchOrders = async () => {
        const res = await axios.get("http://localhost:5000/api/orders/vendor", {
            withCredentials: true,
        });
        setOrders(res.data);
    };

    useEffect(() => {
        fetchItems();
        fetchOrders();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(
                    `http://localhost:5000/api/items/${editId}`,
                    form,
                    { withCredentials: true }
                );
                setEditId(null);
            } else {
                await axios.post("http://localhost:5000/api/items/add", form, {
                    withCredentials: true,
                });
            }
            setForm({ title: "", description: "", price: "" });
            fetchItems();
        } catch {
            alert("Error saving item");
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/items/${id}`, {
            withCredentials: true,
        });
        fetchItems();
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setForm({
            title: item.title,
            description: item.description,
            price: item.price,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-600 text-white p-8">
            <h1 className="text-4xl font-extrabold mb-10 text-center">🧾 Vendor Dashboard</h1>

            {/* --- Add / Edit Item Form --- */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 mb-10 max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    {editId ? "✏️ Edit Item" : "➕ Add New Item"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                >
                    <input
                        type="text"
                        placeholder="Title"
                        className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-300 outline-none"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-300 outline-none"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-blue-300 outline-none"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        required
                    />

                    <button
                        type="submit"
                        className="md:col-span-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all duration-200"
                    >
                        {editId ? "Update Item" : "Add Item"}
                    </button>
                </form>
            </div>

            {/* --- Vendor Items --- */}
            <h2 className="text-2xl font-semibold mb-4 text-center">🧺 Your Items</h2>
            {items.length === 0 ? (
                <p className="text-center text-white/70">No items added yet</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                        >
                            <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                            <p className="text-white/80 mb-2">{item.description}</p>
                            <p className="text-lg font-semibold mb-4">₹{item.price}</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="flex-1 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="flex-1 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Orders Section --- */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-4 text-center">📦 Orders Received</h2>

                {orders.length === 0 ? (
                    <p className="text-center text-white/70">No orders yet</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition"
                            >
                                <p>
                                    <b>Order by:</b> {order.userName}
                                </p>
                                <p className="mt-2 font-semibold">Items:</p>
                                <ul className="ml-5 list-disc text-white/90">
                                    {order.items.map((i) => (
                                        <li key={i.itemId}>
                                            {i.title} × {i.quantity} — ₹{i.price * i.quantity}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-2 font-bold">
                                    Total: ₹
                                    {order.items.reduce(
                                        (sum, i) => sum + i.price * i.quantity,
                                        0
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}