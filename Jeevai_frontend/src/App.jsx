import "./App.css";
import ChatLayout from "./Chatlayout";
import OptInForm from "./OptInForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoutes";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      {/* <Router>
        <Routes>
          <Route path="/login" element={<OptInForm />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Toaster position="top-right" reverseOrder={false} />
      </Router> */}

      <Router>
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <OptInForm />
              </PublicRoute>
            }
          />

          {/* Protected Route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </>
  );
}

export default App;
