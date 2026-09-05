import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import AuthPage from "./pages/Auth";
import Admin from "./pages/Admin";
import TicketConfirmation from "./pages/TicketConfirmation";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="/ticket/:reference" element={<TicketConfirmation />} />
      </Routes>
    </div>
  );
}

export default App;