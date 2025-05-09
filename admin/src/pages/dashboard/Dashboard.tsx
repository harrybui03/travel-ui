import {Header} from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import SideBar from "../../components/SideBar.tsx";
import {Outlet} from "react-router-dom";

export const DashboardLayout = () => (
    <div className="dashboard-layout">
        <Header />
        <div className="dashboard-content flex">
            <SideBar />
            <main className="main-area flex-1">
                <Outlet /> {/* Add Outlet here */}
            </main>
        </div>
        <Footer />
    </div>
);

export const Dashboard = DashboardLayout;