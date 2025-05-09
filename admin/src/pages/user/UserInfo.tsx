import { useAuthStore } from "../../stores/auth.store.ts";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../../model/User.ts";
import { supabase } from "../../utils/supabase.ts";
import { Card, Space, Tag, Typography, Avatar } from "antd"; // Import Avatar

const UserInfo = () => {
    const { user } = useAuthStore();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (user?.email) {
                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("email", user.email);

                if (error) {
                    console.error("Error fetching user:", error);
                    return;
                }

                if (data && data.length > 0) {
                    setCurrentUser(data[0] as User);
                }
            }
        };

        fetchUser();
    }, [user?.email]);

    return (
        <div className="p-4 flex flex-col items-center"> {}
            <Typography.Title level={2} className="mb-4 text-center">User Information</Typography.Title> {}
            {currentUser ? (
                <Card className="w-full max-w-md">
                    <Space direction="vertical" className="w-full items-center"> {/* Center card content */}
                        <Avatar size={64} src="https://via.placeholder.com/150" className="mb-4" /> {}

                        <Typography.Text strong>Name:</Typography.Text>
                        <Typography.Text>{currentUser.name}</Typography.Text>

                        <Typography.Text strong>Email:</Typography.Text>
                        <Typography.Text>{currentUser.email}</Typography.Text>

                        <Typography.Text strong>Phone Number:</Typography.Text>
                        <Typography.Text>{currentUser.phone}</Typography.Text>

                        <Typography.Text strong>Sex:</Typography.Text>
                        <Typography.Text>{currentUser.sex}</Typography.Text>

                        <Typography.Text strong>Birthday:</Typography.Text>
                        <Typography.Text>{currentUser.birthday}</Typography.Text>

                        <Typography.Text strong>Address:</Typography.Text>
                        <Typography.Text>{currentUser.address}</Typography.Text>

                        <Typography.Text strong>Role:</Typography.Text>
                        <Tag color="blue">{currentUser.role}</Tag>
                    </Space>
                </Card>
            ) : (
                <Typography.Text>Loading user information...</Typography.Text>
            )}
            <Outlet />
        </div>
    );
};

export default UserInfo;