import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useContext,
  useEffect,
} from "react";

import PageWrapper from "../components/PageWrapper";

import Navbar from "../components/Navbar";

import {
  CartContext,
} from "../context/CartContext";

export default function OrderSuccess() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    cart = [],
    total = 0,
    quantities = {},
  } = location.state || {};

  const { clearCart } =
    useContext(CartContext);

  useEffect(() => {

    clearCart();

  }, []);

  const getQty = (id) => {

    return quantities[id] || 1;
  };

  return (

    <PageWrapper>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">

        <Navbar />

        <div className="p-8 lg:p-16 max-w-6xl mx-auto">

          {/* SUCCESS CARD */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* TOP */}
            <div className="bg-gradient-to-r from-green-700 to-green-500 p-12 text-center text-white">

              <div className="text-8xl">
                ✅
              </div>

              <h1 className="text-5xl font-bold mt-6">
                Order Placed Successfully
              </h1>

              <p className="text-xl text-green-100 mt-5 leading-relaxed">

                Thank you for shopping with PlantAI.
                Your plants will be delivered soon.

              </p>

            </div>

            {/* ORDER DETAILS */}
            <div className="p-10">

              <h2 className="text-4xl font-bold text-green-700">
                Order Details
              </h2>

              {/* EMPTY */}
              {cart.length === 0 ? (

                <div className="text-center mt-12">

                  <p className="text-2xl text-gray-600">
                    No order details found.
                  </p>

                </div>

              ) : (

                <div className="grid gap-8 mt-10">

                  {cart.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="bg-green-50 rounded-3xl p-6 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg"
                      >

                        {/* LEFT */}
                        <div className="flex items-center gap-6">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-32 rounded-3xl object-cover shadow-lg"
                          />

                          <div>

                            <h3 className="text-3xl font-bold text-green-700">
                              {item.name}
                            </h3>

                            <p className="text-gray-500 mt-3 text-lg">
                              {item.category}
                            </p>

                            <p className="text-green-700 font-bold text-2xl mt-4">
                              ₹{item.price}
                            </p>

                          </div>

                        </div>

                        {/* RIGHT */}
                        <div className="text-center">

                          <p className="text-gray-500 text-lg">
                            Quantity
                          </p>

                          <h3 className="text-3xl font-bold text-green-700 mt-2">
                            {getQty(item.id)}
                          </h3>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

              {/* TOTAL */}
              <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-3xl p-10 text-white mt-12 shadow-2xl">

                <div className="flex items-center justify-between flex-wrap gap-6">

                  <div>

                    <h2 className="text-3xl font-bold">
                      Total Amount
                    </h2>

                    <p className="text-green-100 mt-3 text-lg">
                      Inclusive of all charges
                    </p>

                  </div>

                  <h1 className="text-5xl font-bold">
                    ₹{total}
                  </h1>

                </div>

              </div>

              {/* DELIVERY TRACKING */}
              <div className="bg-white border rounded-3xl p-10 mt-12 shadow-lg">

                <h2 className="text-4xl font-bold text-green-700">
                  Delivery Status 🚚
                </h2>

                <div className="grid md:grid-cols-4 gap-6 mt-10">

                  <div className="bg-green-100 rounded-2xl p-6 text-center">

                    <div className="text-4xl">
                      📦
                    </div>

                    <h3 className="text-xl font-bold text-green-700 mt-4">
                      Order Packed
                    </h3>

                  </div>

                  <div className="bg-green-100 rounded-2xl p-6 text-center">

                    <div className="text-4xl">
                      🚚
                    </div>

                    <h3 className="text-xl font-bold text-green-700 mt-4">
                      Shipped
                    </h3>

                  </div>

                  <div className="bg-green-100 rounded-2xl p-6 text-center">

                    <div className="text-4xl">
                      🌿
                    </div>

                    <h3 className="text-xl font-bold text-green-700 mt-4">
                      Out For Delivery
                    </h3>

                  </div>

                  <div className="bg-green-100 rounded-2xl p-6 text-center">

                    <div className="text-4xl">
                      🏡
                    </div>

                    <h3 className="text-xl font-bold text-green-700 mt-4">
                      Delivered
                    </h3>

                  </div>

                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-6 mt-12">

                <button
                  onClick={() =>
                    navigate("/shop")
                  }
                  className="bg-green-700 text-white px-10 py-5 rounded-2xl hover:bg-green-800 transition duration-300 text-xl font-bold shadow-xl"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="bg-white border-2 border-green-700 text-green-700 px-10 py-5 rounded-2xl hover:bg-green-50 transition duration-300 text-xl font-bold"
                >
                  Go To Dashboard
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </PageWrapper>
  );
}