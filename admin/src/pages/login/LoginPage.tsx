import { Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useState, useEffect } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Header } from '../../components/Header';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { login, loading, error, user, getSession } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        getSession()
    }, [])

    useEffect(() => {
        if (error) {
            toast.error('Login failed wrong email or password!');
        }
    }, [error]);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            await login(email, password);
        } catch (err) {
            console.error('Validation failed:', err);
            toast.error('Validation failed. Please check your inputs.');
        }
    };

    return (
        <>
            <Header />
            <Toaster position="top-right" />
            <div className="bg-gray-100 min-h-screen flex justify-center items-stretch ">
                <Card title="Login" style={{ border: 'none', maxHeight: 350 , marginTop: 50 }}>
                    <Form form={form} layout="vertical" onFinish={handleSubmit} className="mb-4">
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined style={{ fill: '#D1D5DB' }} />}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                            <Input.Password
                                prefix={<LockOutlined style={{ fill: '#D1D5DB' }} />}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                size="large"
                            />
                        </Form.Item>

                        <Typography className="max-w-xs text-sm" style={{ color: '#4B5563' }}>
                            If you do not have an account, please contact Admin to request access.
                        </Typography>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block size="large" className="mt-2">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
}