import {mockBlogs} from "../mockdata/mockData.ts";
import BlogCard from "./BlogCard.tsx";

const BlogList = ({ blogs }: { blogs: typeof mockBlogs }) => {
    return (
        <div className="container mx-auto py-12">
            <h2 className="text-3xl font-semibold mb-8 text-center">Latest from our Blog</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
};

export default BlogList;