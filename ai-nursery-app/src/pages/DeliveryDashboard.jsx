import { API_URL } from "../config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Search, ChevronDown } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";

export default function DeliveryDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching all orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Out for Delivery": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />

        <div className="max-w-7xl mx-auto px-5 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-green-700" />
              Delivery Dashboard
            </h1>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-64 shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center text-gray-500">No orders found in the system.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Order ID</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Customer</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-800">{order.user?.name || "Unknown"}</div>
                          <div className="text-xs text-gray-500">{order.user?.email || ""}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-700">
                          ₹{order.totalAmount}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative inline-block w-40">
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value)}
                              disabled={updatingId === order._id}
                              className="block w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer disabled:opacity-50 transition"
                            >
                              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
