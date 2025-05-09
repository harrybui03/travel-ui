import { Menu, MenuProps } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";

interface MenuOptionsProps {
    email: string | undefined;
    onViewInfo?: () => void;
    onLogout?: () => void;
}
type MenuItem = Required<MenuProps>['items'][number];

const MenuOptions: React.FC<MenuOptionsProps> = ({ email, onLogout, onChangePassword }) => {
    const handleClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout' && onLogout) {
            onLogout();
        } else if(e.key === 'change-password' && onChangePassword) {
            onChangePassword()
        }
    };

    const items: MenuItem[] = [
        {
            key: 'user-dropdown',
            icon: <UserOutlined />,
            label: email || 'User',
            children: [
                {
                    key:'change-password',
                    label: 'Change Password'
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