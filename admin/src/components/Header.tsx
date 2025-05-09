import { Menu, Typography } from 'antd';
import { useAuthStore } from "../stores/auth.store.ts";
import MenuOptions from "./MenuOptions.tsx";
import React from "react";
import {useNavigate} from "react-router-dom";

export const Header = () => {
    const { Title } = Typography;
    const {user , logout } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async  () => {
        await logout()
    }

    const handleChangePassword = () => {
        navigate('/dashboard/change-password')
    }

    return (
        <div className="bg-blue-900 flex items-center p-4">
            <Title level={3} style={{ color: 'white', margin: 0 }}>
                Travel Admin Site
            </Title>
            {user?.email && (
                <Menu
                    mode="horizontal"
                    style={{ backgroundColor: 'transparent', color: 'white', marginLeft: 'auto' }}
                >
                    <MenuOptions
                        email={user.email}
                        onLogout={handleLogout}
                        onChangePassword={handleChangePassword}
                    />
                </Menu>
            )}
        </div>
    );
};