import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import Swal from 'sweetalert2';

import { loginUser, saveToken } from '../../api/api';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLogin = async (values: any) => {
        setIsLoading(true);
        try {
            const response = await loginUser({
                email: values.email,
                password: values.password
            });

            if (response.success) {
                saveToken(response.data.token);
                dispatch(setUser(response.data.user));
                navigate('/dashboard');
            } else {
                Swal.fire({
                    title: 'Login Failed',
                    text: response.message || 'Login failed',
                    icon: 'error',
                    confirmButtonColor: '#EF4444'
                });
            }
        } catch (err: any) {
            console.error('Login error:', err);
            Swal.fire({
                title: 'Error',
                text: err.message || 'An unexpected error occurred',
                icon: 'error',
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]" />

            <Card variant="glass" className="max-w-md w-full animate-fade-in relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl primary-gradient mb-4 text-white p-3 shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-300">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-text-primary">Welcome Back</h1>
                    <p className="text-text-secondary mt-2">Sign in to continue to Africa Data Solutions</p>
                </div>


                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                leftIcon={<Mail size={18} />}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                error={touched.email ? errors.email : undefined}
                            />

                            <Input
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                leftIcon={<Lock size={18} />}
                                rightIcon={
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                error={touched.password ? errors.password : undefined}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="remember" className="text-sm font-medium text-gray-700">Remember me</label>
                                </div>
                                <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full shadow-lg shadow-primary/20"
                                isLoading={isLoading}
                                rightIcon={!isLoading && <LogIn size={20} />}
                            >
                                Sign In
                            </Button>
                        </form>
                    )}
                </Formik>

                <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-white/10">
                    <p className="text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-primary hover:text-blue-600 hover:underline transition-all">
                            Create an account
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
