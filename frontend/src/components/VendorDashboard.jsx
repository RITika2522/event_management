import { useEffect, useState } from "react";
import axios from "axios";

export default function VendorDashboard() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", price: "" });
    const [editId, setEditId] = useState(null);

    const fetchItems = async () => {
        const res = await axios.get("http://localhost:5000/api/items");
        setItems(res.data);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/items/${editId}`, form, { withCredentials: true });
                setEditId(null);
            } else {
                await axios.post("http://localhost:5000/api/items/add", form, { withCredentials: true });
            }
            setForm({ title: "", description: "", price: "" });
            fetchItems();
        } catch {
            alert("Error saving item");
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/items/${id}`, { withCredentials: true });
        fetchItems();
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setForm({ title: item.title, description: item.description, price: item.price });
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>

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

            <ul>
                {items.map((item) => (
                    <li key={item._id} className="border p-2 mb-2 flex justify-between">
                        <div>
                            <b>{item.title}</b> - ₹{item.price}
                            <p>{item.description}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(item)} className="bg-yellow-400 px-2 py-1 mr-2 rounded">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(item._id)} className="bg-red-500 px-2 py-1 rounded text-white">
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}