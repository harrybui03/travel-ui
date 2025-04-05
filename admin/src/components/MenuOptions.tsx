import { Menu, MenuProps } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";

interface MenuOptionsProps {
    email: string | undefined;
    onViewInfo?: () => void;
    onLogout?: () => void;
}
type MenuItem = Required<MenuProps>['items'][number];

const MenuOptions: React.FC<MenuOptionsProps> = ({ email, onViewInfo, onLogout }) => {
    const handleClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'view-info' && onViewInfo) {
            onViewInfo();
        } else if (e.key === 'logout' && onLogout) {
            onLogout();
        }
    };

    const items: MenuItem[] = [
        {
            key: 'user-dropdown',
            icon: <UserOutlined />,
            label: email || 'User',
            children: [
                {
                    key: 'view-info',
                    label: 'View Information User',
                },
                {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Log Out',
                    danger: true,
                },
            ],
        },
    ];

    return (
        <Menu
            mode="horizontal"
            onClick={handleClick}
            items={items}
        />
    );
};

export default MenuOptions;