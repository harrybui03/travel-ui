import React, { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    AppstoreOutlined,
    GlobalOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, CaretUpOutlined, DollarOutlined,
} from "@ant-design/icons";

const SideBar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', width: '10%' }}>
            <Menu
                mode="vertical"
                defaultSelectedKeys={['dashboard']}
                style={{ flexGrow: 1, borderRight: 0, backgroundColor: '#f3e6e4' }}
                inlineCollapsed={collapsed}
            >
                <Menu.Item
                    key="toggle"
                    onClick={toggleCollapsed}
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    style={{ cursor: 'pointer' }}
                />
                <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                    <Link to="/dashboard">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="user-info" icon={<UserOutlined />}>
                    <Link to="/dashboard/user-info">Information current user</Link>
                </Menu.Item>
                <Menu.Item key="manage-customers" icon={<TeamOutlined />}>
                    <Link to="/dashboard/manage-customers">Manage customers</Link>
                </Menu.Item>
                <Menu.Item key="manage-services" icon={<AppstoreOutlined />}>
                    <Link to="/dashboard/manage-services">Manage services</Link>
                </Menu.Item>
                <Menu.Item key="manage-destinations" icon={<GlobalOutlined />}>
                    <Link to="/dashboard/manage-destinations">Manage destinations</Link>
                </Menu.Item>
                <Menu.Item key="manage-employees" icon={<GlobalOutlined />}>
                    <Link to="/dashboard/manage-employees">Manage employees</Link>
                </Menu.Item>
                <Menu.Item key="assign-tour" icon={<CaretUpOutlined />}>
                    <Link to="/dashboard/assign-tour">Assign Tour for Tour Guides</Link>
                </Menu.Item>
                <Menu.Item key="tour-statistics" icon={<DollarOutlined />}>
                    <Link to="/dashboard/tour-statistics">Tour Statistics</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default SideBar;