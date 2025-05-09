import {Layout} from "antd";
import Header from "../components/Header.tsx";
import MainContent from "../components/MainContent.tsx";
import Footer from "../components/Footer.tsx";

const HomePage = () => {
    return (
        <Layout className="min-h-screen">
            <Header />
            <Layout.Content>
                <MainContent />
            </Layout.Content>
            <Footer />
        </Layout>
    );
};

export default HomePage;