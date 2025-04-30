import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Loading from "./components/Loading";
import AuthForm from "./components/AuthForm";
import Landing from "./Landing";
import CompleteProfile from "./CompleteProfile";
import NotActive from "./components/NotActive";
import DashboardPage from "./components/DashboardPage";
import AdminDashboardPage from "./components/AdminDashboardPage";
import TeacherProfile from "./components/TeacherProfile";
import DashboardTeacher from "./components/DashboardTeacher";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setUserRole(data.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/authenticate");
      }
    };

    fetchUserRole();
  }, [navigate]);

  if (userRole === null) {
    return <Loading />;
  }

  return allowedRoles.includes(userRole) ? children : <Navigate to="/" />;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (document.cookie.includes("token")) {
      const encryptedToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];
      const decryptedToken = atob(encryptedToken);
      localStorage.setItem("token", decryptedToken);
    }

    if (!localStorage.getItem("token")) {
      navigate("/authenticate");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setUserData(data);
        if (data.data.profile_completed !== true) {
          navigate("/complete-profile");
        } else if (data.data.is_active !== true) {
          // navigate("/not-active");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/authenticate");
      }
    };

    fetchData();
  }, [navigate]);

  if (!userData) {
    return <Loading />;
  }

  return <DashboardPage />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/authenticate" element={<AuthForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <DashboardTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/not-active" element={<NotActive />} />
        <Route
          path="/teacher/:teacherId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
