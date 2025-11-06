import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/api/items");
    setItems(res.data);
  };

  const fetchCart = async () => {
    const res = await axios.get("http://localhost:5000/api/cart", {
      withCredentials: true,
    });
    setCart(res.data?.items || []);
  };

  useEffect(() => {
    fetchItems();
    fetchCart();
  }, []);

  const addToCart = async (id) => {
    await axios.post(
      `http://localhost:5000/api/cart/add/${id}`,
      {},
      { withCredentials: true }
    );
    fetchCart();
  };

  const decreaseQuantity = async (id) => {
    await axios.post(
      `http://localhost:5000/api/cart/decrease/${id}`,
      {},
      { withCredentials: true }
    );
    fetchCart();
  };

  const placeOrder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders/place",
        {},
        { withCredentials: true }
      );
      alert("Order placed successfully!");
      fetchCart();
    } catch (err) {
      alert("Error placing order");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* --- All Items --- */}
      <h2 className="text-lg font-semibold mb-2">All Items</h2>
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
            <button
              onClick={() => addToCart(item._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      {/* --- Cart Section --- */}
      <h2 className="text-lg font-semibold mt-8 mb-2">Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li
                key={item.itemId}
                className="border p-2 mb-2 flex justify-between items-center"
              >
                <div>
                  <b>{item.title}</b> - ₹{item.price} × {item.quantity}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item.itemId)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    −
                  </button>
                  <button
                    onClick={() => addToCart(item.itemId)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={placeOrder}
            className={`mt-4 px-4 py-2 rounded text-white ${
              cart.length > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={cart.length === 0}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}