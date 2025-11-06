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
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>

            {/* --- Add / Edit Item Form --- */}
            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    placeholder="Title"
                    className="border p-2 mr-2"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    className="border p-2 mr-2"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    className="border p-2 mr-2"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editId ? "Update Item" : "Add Item"}
                </button>
            </form>

            {/* --- Vendor Items --- */}
            <h2 className="text-lg font-semibold mb-2">Your Items</h2>
            <ul>
                {items.map((item) => (
                    <li
                        key={item._id}
                        className="border p-2 mb-2 flex justify-between items-center"
                    >
                        <div>
                            <b>{item.title}</b> - ₹{item.price}
                            <p>{item.description}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleEdit(item)}
                                className="bg-yellow-400 px-2 py-1 mr-2 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-red-500 px-2 py-1 rounded text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* --- Orders Section --- */}
            <h2 className="text-lg font-semibold mt-8 mb-2">Orders Received</h2>
            {orders.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order._id} className="border p-2 mb-3">
                            <b>Order by:</b> {order.userName} <br />
                            <b>Items:</b>
                            <ul className="ml-4">
                                {order.items.map((i) => (
                                    <li key={i.itemId}>
                                        {i.title} × {i.quantity} — ₹{i.price * i.quantity}
                                    </li>
                                ))}
                            </ul>
                            <b>Total:</b> ₹
                            {order.items.reduce(
                                (sum, i) => sum + i.price * i.quantity,
                                0
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}