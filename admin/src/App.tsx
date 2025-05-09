import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.tsx";
import {Dashboard} from "./pages/dashboard/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import UserInfo from "./pages/user/UserInfo.tsx";
import ManageCustomers from "./pages/customers/ManageCustomers.tsx";
import MangeDestinations from "./pages/destinations/MangeDestinations.tsx";
import ManageTours from "./pages/tours/ManageTours.tsx";
import ManageService from "./pages/services/ManageService.tsx";
import ManagePartners from "./pages/partners/ManagePartners.tsx";
import ManageTourGuides from "./pages/tour-guides/ManageTourGuides.tsx";
import ChangePassword from "./pages/change-password/ChangePassword.tsx";
import AssignTours from "./pages/assign-tour/AssignTours.tsx";
import TourStatistics from "./pages/statistics/TourStatistics.tsx";

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
                    <Route path="manage-tours" element={<ManageTours />}/>
                    <Route path="manage-services" element={<ManageService />}/>
                    <Route path="manage-partners" element={<ManagePartners />}/>
                    <Route path="manage-tour-guides" element={<ManageTourGuides />}/>
                    <Route path="manage-employees" element={<ManageTourGuides />}/>
                    <Route path="change-password" element={<ChangePassword />}/>
                    <Route path="assign-tour" element={<AssignTours />}/>
                    <Route path="tour-statistics" element={<TourStatistics/>}/>

                </Route>
                <Route path="/" element={<Navigate to="/dashboard" replace />} /> {}
            </Routes>
        </Router>
    );
}

export default App;
