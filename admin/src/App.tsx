import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.tsx";
import {Dashboard} from "./pages/dashboard/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import UserInfo from "./pages/user/UserInfo.tsx";
import ManageCustomers from "./pages/customers/ManageCustomers.tsx";
import MangeDestinations from "./pages/destinations/MangeDestinations.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard/*"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="user-info" element={<UserInfo />} />
                    <Route path="manage-customers" element={<ManageCustomers />} />
                    <Route path="manage-destinations" element={<MangeDestinations />} />
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" replace />} /> {}
            </Routes>
        </Router>
    );
}

export default App;
