import React from 'react';
import { Button, Form, Input } from "antd";
import { KeyOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../stores/auth.store.ts";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const { changePassword, verifyPassword, user, loading, error } = useAuthStore();

    const onFinish = async (values: any) => {
        if (!user?.email) {
            toast.error("User email not found. Cannot verify current password.");
            return;
        }

        const isCurrentPasswordCorrect = await verifyPassword(user.email, values.currentPassword);

        if (isCurrentPasswordCorrect) {
            await changePassword(values.newPassword);
            if (!error) {
                toast.success('Password updated successfully!');
                form.resetFields();
            } else {
                toast.error(error);
            }
        } else {
            toast.error("Incorrect current password.");
        }
    };

    const validateConfirmPassword = ({ getFieldValue }: any) => ({
        validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
    });

    const validateNewPassword = () => ({
        validator(_, value) {
            if (!value) {
                return Promise.reject(new Error('Please input your new password!'));
            }
            if (value.length < 6) {
                return Promise.reject(new Error('Password must be at least 6 characters!'));
            }
            const hasLower = /[a-z]/.test(value);
            const hasUpper = /[A-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);

            if (!hasLower || !hasUpper || !hasNumber) {
                return Promise.reject(
                    new Error(
                        'Password must contain at least one lowercase letter, one uppercase letter, and one number!'
                    )
                );
            }
            return Promise.resolve();
        },
    });

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Change Password</h2>
                <Form
                    form={form}
                    name="change_password"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Please input your current password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Current Password"
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            validateNewPassword
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<KeyOutlined className="site-form-item-icon" />}
                            placeholder="New Password"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmNewPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            validateConfirmPassword,
                        ]}
                    >
                        <Input.Password
                            prefix={<KeyOutlined className="site-form-item-icon" />}
                            placeholder="Confirm New Password"
                        />
                    </Form.Item>

                    <Form.Item className="mt-6">
                        <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ChangePassword;