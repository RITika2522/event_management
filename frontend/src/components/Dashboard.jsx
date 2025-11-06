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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center">🛍️ User Dashboard</h1>

      {/* --- All Items Section --- */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Available Items</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-white/80 mb-3">{item.description}</p>
            <p className="text-lg font-semibold mb-4">₹{item.price}</p>
            <button
              onClick={() => addToCart(item._id)}
              className="w-full py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all duration-200"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* --- Cart Section --- */}
      <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">🛒 Your Cart</h2>

        {cart.length === 0 ? (
          <p className="text-center text-white/80">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between items-center bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div>
                    <p className="font-semibold text-lg">{item.title}</p>
                    <p className="text-white/80 text-sm">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(item.itemId)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      −
                    </button>
                    <button
                      onClick={() => addToCart(item.itemId)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={placeOrder}
                disabled={cart.length === 0}
                className={`px-6 py-2 rounded-lg font-semibold shadow-lg transition-all ${
                  cart.length > 0
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}