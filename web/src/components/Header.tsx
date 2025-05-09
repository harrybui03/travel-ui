import {Layout, Menu} from "antd";
import {EnvironmentOutlined} from "@ant-design/icons";

const Header = () => {
    return (
        <Layout.Header className="bg-white">
            <div className="container mx-auto flex justify-between items-center h-full">
                <h1 className="text-2xl font-bold text-blue-600">
                    <EnvironmentOutlined className="inline-block mr-2" />
                    Travel Website
                </h1>
                <Menu mode="horizontal" className="border-none">
                    <Menu.Item key="home">Home</Menu.Item>
                    <Menu.Item key="tours">Tours</Menu.Item>
                    <Menu.Item key="blogs">Blogs</Menu.Item>
                    <Menu.Item key="about">About</Menu.Item>
                </Menu>
            </div>
        </Layout.Header>
    );
};

export default Header;