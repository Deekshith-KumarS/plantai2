import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import OrderSuccess from "./pages/OrderSuccess";
import PlantDetails from "./pages/PlantDetails";
import DiseaseDetection from "./pages/DiseaseDetection";
import PlantMonitor from "./pages/PlantMonitor";
import RescueMap from "./pages/RescueMap";
import CreateRescue from "./pages/CreateRescue";
import RescueDetails from "./pages/RescueDetails";
import RescueDashboard from "./pages/RescueDashboard";
import RescueChat from "./pages/RescueChat";
import RescueAdminPanel from "./pages/RescueAdminPanel";
import RescueLeaderboard from "./pages/RescueLeaderboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import FloatingChat from "./components/FloatingChat";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AccessDenied from "./pages/AccessDenied";

function App() {
  return (
    <>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plant/:id"
          element={
            <ProtectedRoute>
              <PlantDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/disease-detection"
          element={
            <ProtectedRoute>
              <DiseaseDetection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitor"
          element={
            <ProtectedRoute>
              <PlantMonitor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rescue-map"
          element={
            <ProtectedRoute>
              <RescueMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rescue/create"
          element={
            <ProtectedRoute>
              <CreateRescue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rescue/dashboard"
          element={
            <ProtectedRoute>
              <RescueDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rescue/:id"
          element={
            <ProtectedRoute>
              <RescueDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rescue/messages"
          element={
            <ProtectedRoute>
              <RescueChat />
            </ProtectedRoute>
          }
        />
        
        <Route path="/rescue/leaderboard" element={<RescueLeaderboard />} />

        <Route
          path="/delivery-hub"
          element={
            <AdminRoute>
              <DeliveryDashboard />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/rescue"
          element={
            <AdminRoute>
              <RescueAdminPanel />
            </AdminRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        <Route path="/access-denied" element={<AccessDenied />} />

      </Routes>

      {/* FLOATING CHAT — only shows if logged in */}
      {localStorage.getItem("token") && <FloatingChat />}
    </>
  );
}

export default App;