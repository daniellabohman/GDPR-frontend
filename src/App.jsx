import React from "react";
import { isAuthenticated } from "./utils/auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Analyser from "./pages/Analyser";
import PolicyDetails from "./pages/PolicyDetails";
import PolicyHistory from "./pages/PolicyHistory";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import AIGenerator from "./pages/AIGenerator";
import BlogAdminPanel from "./pages/Admin";
import BlogEdit from "./pages/BlogEdit";


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

        {/* Policy routes */}
        <Route
          path="/policy/:policyId"
          element={
            <PrivateRoute>
              <PolicyDetails />
            </PrivateRoute>
          }
        />
        <Route path="/politik-historik" element={<PolicyHistory />} />

        <Route
          path="/analyser"
          element={
            <PrivateRoute>
              <Analyser />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-generator"
          element={
            <PrivateRoute>
              <AIGenerator />
            </PrivateRoute>
          }
        />


      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly={true}>
            <BlogAdminPanel />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/blog/:slug/edit"
        element={
          <PrivateRoute adminOnly={true}>
            <BlogEdit />
          </PrivateRoute>
        }
      />


        {/* Catch-all til 404 eller redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
