import {cardVariants, mockBlogs} from "../mockdata/mockData.ts";
import {Card} from "antd";
import {BookOutlined} from "@ant-design/icons";
import { motion } from 'framer-motion';
const BlogCard = ({ blog }: { blog: typeof mockBlogs[0] }) => {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            <Card
                hoverable
                cover={<img alt={blog.title} src={blog.imageUrl} className="h-32 object-cover w-full" />}
                className="mb-6 transition-transform transform hover:scale-105"
            >
                <Card.Meta
                    title={blog.title}
                    description={
                        <div className="flex justify-between items-center">
                            <span>{blog.date}</span>
                            <BookOutlined />
                        </div>
                    }
                />
            </Card>
        </motion.div>
    );
};

export default BlogCard;