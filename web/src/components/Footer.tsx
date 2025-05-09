import {Layout} from "antd";

const Footer = () => {
    return (
        <Layout.Footer className="bg-gray-800 text-white text-center py-6">
            <p>&copy; {new Date().getFullYear()} Travel Website. All rights reserved.</p>
        </Layout.Footer>
    );
};

export default Footer;