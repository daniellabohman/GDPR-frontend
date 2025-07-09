import React from "react";
import { isAuthenticated } from "./utils/auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Analyser from "./pages/Analyser";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route: redirect til dashboard hvis logget ind */}
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/analyser"
          element={
            <PrivateRoute>
              <Analyser />
            </PrivateRoute>
          }
        />
        <Route path="/privatlivspolitik" element={<PrivacyPolicyPage />} />



        {/* Catch-all til 404 eller redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
