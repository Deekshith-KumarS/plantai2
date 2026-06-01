import { API_URL } from "../config";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Clock, CheckCircle, Truck, 
  MapPin, CreditCard, ChevronRight, Check, ShoppingBag
} from "lucide-react";

import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import { CartContext } from "../context/CartContext";

const orderStages = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered"];
const getStageIndex = (status) => orderStages.indexOf(status);

const OrderTracker = ({ currentStatus }) => {
  const currentIndex = getStageIndex(currentStatus);
  return (
    <div className="w-full py-8 mb-4 px-4 sm:px-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-6 transform -translate-y-1/2 w-full h-1.5 bg-gray-100 rounded-full -z-10"></div>
        <div 
          className="absolute left-0 top-6 transform -translate-y-1/2 h-1.5 bg-green-500 rounded-full -z-10 transition-all duration-700 ease-in-out" 
          style={{ width: `${(Math.max(0, currentIndex) / (orderStages.length - 1)) * 100}%` }}
        ></div>
        {orderStages.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={stage} className="flex flex-col items-center relative z-10 w-20">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white transition-all duration-500 ${isCompleted ? 'bg-green-600 text-white shadow-lg shadow-green-200/50 scale-110' : 'bg-gray-200 text-gray-400'}`}>
                {isCompleted ? <Check className="w-6 h-6" /> : idx + 1}
              </div>
              <p className={`text-xs font-bold mt-3 text-center transition-colors duration-500 ${isCurrent ? 'text-green-700' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                {stage}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, increaseQty, decreaseQty, getQty, clearCart } = useContext(CartContext);
  
  const [activeTab, setActiveTab] = useState("active"); // "active" or "history"
  
  // Checkout flow state
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "India"
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  
  // Order history state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * getQty(item.id), 0);

  // Fetch orders when switching to history tab
  useEffect(() => {
    if (activeTab === "history") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleNextStep = () => {
    if (checkoutStep === 2) {
      if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
        alert("Please fill in all shipping details.");
        return;
      }
    }
    if (checkoutStep === 3) {
      if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
      }
      placeOrder();
      return;
    }
    setCheckoutStep((prev) => prev + 1);
  };

  const placeOrder = async () => {
    try {
      const orderItems = cart.map((item) => ({
        ...item,
        qty: getQty(item.id),
      }));

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to place an order.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: total,
          shippingAddress,
          paymentMethod
        }),
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        navigate("/order-success", {
          state: { cart, total, quantities: Object.fromEntries(cart.map(i => [i.id, getQty(i.id)])) },
        });
      } else {
        alert(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Server error while placing order.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "Processing": return <Package className="w-4 h-4 text-blue-600" />;
      case "Shipped": return <Truck className="w-4 h-4 text-purple-600" />;
      case "Delivered": return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />

        <div className="max-w-6xl mx-auto px-5 pt-10">
          <BackButton />

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="w-10 h-10 text-green-700" />
              Your Cart
            </h1>

            {/* TAB TOGGLE */}
            <div className="bg-gray-200/50 p-1 rounded-xl flex items-center shadow-inner">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === "active" ? "bg-white text-green-800 shadow-md" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Active Cart
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === "history" ? "bg-white text-green-800 shadow-md" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Past Orders
              </button>
            </div>
          </div>

          {activeTab === "active" ? (
            cart.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 mt-12 text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">Your cart is empty</h2>
                <p className="text-gray-500 mt-4 text-lg">Looks like you haven't added any plants yet.</p>
                <button
                  onClick={() => navigate("/shop")}
                  className="mt-8 bg-green-700 text-white px-8 py-3.5 rounded-xl hover:bg-green-800 transition font-semibold shadow-lg shadow-green-200"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* LEFT COLUMN: CHECKOUT FLOW */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* STEP 1: REVIEW CART */}
                  <div className={`bg-white rounded-2xl shadow-sm border ${checkoutStep === 1 ? 'border-green-500 ring-4 ring-green-50' : 'border-gray-100 opacity-60'} overflow-hidden transition-all duration-300`}>
                    <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between cursor-pointer" onClick={() => setCheckoutStep(1)}>
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${checkoutStep >= 1 ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-500'}`}>1</span>
                        Review Items
                      </h2>
                      {checkoutStep > 1 && <Check className="w-6 h-6 text-green-600" />}
                    </div>
                    
                    {checkoutStep === 1 && (
                      <div className="p-8">
                        <div className="space-y-6">
                          {cart.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-xl">
                              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover shadow-sm" />
                              <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                <p className="text-green-700 font-semibold mt-1">₹{item.price}</p>
                              </div>
                              <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                <button onClick={() => decreaseQty(item.id)} className="text-gray-500 hover:text-green-700 font-bold text-xl">−</button>
                                <span className="font-bold text-gray-800 min-w-[1.5rem] text-center">{getQty(item.id)}</span>
                                <button onClick={() => increaseQty(item.id)} className="text-gray-500 hover:text-green-700 font-bold text-xl">+</button>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold underline sm:ml-4">Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 2: SHIPPING DETAILS */}
                  <div className={`bg-white rounded-2xl shadow-sm border ${checkoutStep === 2 ? 'border-green-500 ring-4 ring-green-50' : 'border-gray-100 opacity-60'} overflow-hidden transition-all duration-300`}>
                    <div className={`px-8 py-5 border-b border-gray-100 flex items-center justify-between ${checkoutStep > 2 ? 'cursor-pointer' : ''}`} onClick={() => checkoutStep > 2 && setCheckoutStep(2)}>
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${checkoutStep >= 2 ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-500'}`}>2</span>
                        Shipping Address
                      </h2>
                      {checkoutStep > 2 && <Check className="w-6 h-6 text-green-600" />}
                    </div>
                    
                    {checkoutStep === 2 && (
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input 
                              type="text" 
                              value={shippingAddress.fullName}
                              onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                              placeholder="John Doe" 
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                            <input 
                              type="text" 
                              value={shippingAddress.address}
                              onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                              placeholder="123 Plant Street" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                            <input 
                              type="text" 
                              value={shippingAddress.city}
                              onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                              placeholder="Mumbai" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP / Postal Code</label>
                            <input 
                              type="text" 
                              value={shippingAddress.zipCode}
                              onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" 
                              placeholder="400001" 
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 3: PAYMENT OPTIONS */}
                  <div className={`bg-white rounded-2xl shadow-sm border ${checkoutStep === 3 ? 'border-green-500 ring-4 ring-green-50' : 'border-gray-100 opacity-60'} overflow-hidden transition-all duration-300`}>
                    <div className="px-8 py-5 border-b border-gray-100 flex items-center">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${checkoutStep >= 3 ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-500'}`}>3</span>
                        Payment Method
                      </h2>
                    </div>
                    
                    {checkoutStep === 3 && (
                      <div className="p-8">
                        <div className="space-y-4">
                          {["Credit / Debit Card", "UPI", "Cash on Delivery"].map((method) => (
                            <label key={method} className={`flex items-center p-5 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === method ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                              <input 
                                type="radio" 
                                name="payment" 
                                value={method} 
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-5 h-5 text-green-600 focus:ring-green-500 cursor-pointer"
                              />
                              <span className="ml-4 font-semibold text-gray-800">{method}</span>
                              {method === "Credit / Debit Card" && <CreditCard className="ml-auto w-6 h-6 text-gray-400" />}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: ORDER SUMMARY */}
                <div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-28">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({cart.length} items)</span>
                        <span className="font-semibold text-gray-800">₹{total}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="font-semibold text-green-600">Free</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                      <span className="text-gray-800 font-bold">Order Total</span>
                      <span className="text-3xl font-bold text-green-700">₹{total}</span>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="w-full bg-green-700 text-white py-4 rounded-xl hover:bg-green-800 transition text-lg font-bold shadow-lg shadow-green-200 flex justify-center items-center gap-2"
                    >
                      {checkoutStep === 3 ? "Place Order" : "Continue to Next Step"}
                      {checkoutStep < 3 && <ChevronRight className="w-5 h-5" />}
                    </button>
                    
                    {checkoutStep === 3 && (
                      <p className="text-xs text-gray-400 text-center mt-4">
                        By placing your order, you agree to our terms of service and privacy policy.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            )
          ) : (
            /* PAST ORDERS TAB */
            <div className="mt-12">
              {loadingOrders ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-2xl mx-auto">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">No past orders</h2>
                  <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Order Placed</p>
                          <p className="text-gray-800 font-semibold mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total</p>
                          <p className="text-green-700 font-bold mt-1">₹{order.totalAmount}</p>
                        </div>
                        <div className="flex-1 md:text-right text-left">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Order ID</p>
                          <p className="text-gray-800 font-mono text-sm mt-1">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="p-6">
                        <OrderTracker currentStatus={order.status} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 border border-gray-100 p-4 rounded-xl">
                              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                              <div className="flex-1">
                                <p className="font-bold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500 mt-1">Qty: {item.qty} &bull; ₹{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {(order.shippingAddress || order.paymentMethod) && (
                          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {order.shippingAddress && (
                              <div>
                                <p className="text-sm font-semibold text-gray-800 mb-2">Shipping Address</p>
                                <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
                                <p className="text-sm text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zipCode}</p>
                              </div>
                            )}
                            {order.paymentMethod && (
                              <div>
                                <p className="text-sm font-semibold text-gray-800 mb-2">Payment Method</p>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-gray-400" />
                                  {order.paymentMethod}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}