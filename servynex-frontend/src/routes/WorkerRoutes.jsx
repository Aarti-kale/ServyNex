import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const WorkerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "worker") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default WorkerRoute;
