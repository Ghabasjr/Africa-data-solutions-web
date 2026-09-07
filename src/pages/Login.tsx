import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { useDispatch } from 'react-redux';
import { setUser, setRefreshToken } from '../store';
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

const TwoFactorSchema = Yup.object().shape({
    twoFactorCode: Yup.string()
        .required('2FA code is required')
        .length(6, 'Code must be 6 digits'),
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    // When the server signals 2FA is required, we store the pending credentials here
    const [pendingCredentials, setPendingCredentials] = React.useState<{ email: string; password: string } | null>(null);

    const attemptLogin = async (values: { email: string; password: string; twoFactorCode?: string }) => {
        setIsLoading(true);
        try {
            const response = await loginUser({
                email: values.email,
                password: values.password,
                twoFactorCode: values.twoFactorCode,
            });

            if (response.success) {
                const { data } = response;

                // Server may require 2FA before issuing tokens
                if (data.twoFactorRequired && !values.twoFactorCode) {
                    setPendingCredentials({ email: values.email, password: values.password });
                    return;
                }

                // Store tokens
                const token = data.accessToken || (data as any).token;
                if (token) saveToken(token);
                if (data.refreshToken) dispatch(setRefreshToken(data.refreshToken));

                dispatch(setUser(data.user));

                Swal.fire({
                    title: 'Welcome Back!',
                    text: response.message || 'Login successful',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                });

                navigate('/dashboard');
            } else {
                Swal.fire({
                    title: 'Login Failed',
                    text: response.message || 'Invalid credentials. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#EF4444',
                });
            }
        } catch (err: any) {
            console.error('Login error:', err);
            Swal.fire({
                title: 'Login Failed',
                text: err.message || 'An unexpected error occurred',
                icon: 'error',
                confirmButtonColor: '#EF4444',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // ─── 2FA Screen ───────────────────────────────────────────────────
    if (pendingCredentials) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
                <SEO title="Two-Factor Authentication" description="Verify your identity to continue." />
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]" />

                <Card variant="glass" className="max-w-md w-full animate-fade-in relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl primary-gradient mb-4 text-white p-3 shadow-lg shadow-primary/30">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">2FA Verification</h1>
                        <p className="text-text-secondary mt-2">Enter the 6-digit code from your authenticator app.</p>
                    </div>

                    <Formik
                        initialValues={{ twoFactorCode: '' }}
                        validationSchema={TwoFactorSchema}
                        onSubmit={(values) =>
                            attemptLogin({ ...pendingCredentials, twoFactorCode: values.twoFactorCode })
                        }
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    label="Authentication Code"
                                    name="twoFactorCode"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="000000"
                                    leftIcon={<ShieldCheck size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.twoFactorCode}
                                    error={touched.twoFactorCode ? errors.twoFactorCode : undefined}
                                />
                                <Button
                                    type="submit"
                                    className="w-full shadow-lg shadow-primary/20"
                                    isLoading={isLoading}
                                >
                                    Verify & Sign In
                                </Button>
                                <button
                                    type="button"
                                    className="w-full text-sm text-text-secondary hover:text-primary transition-colors"
                                    onClick={() => setPendingCredentials(null)}
                                >
                                    ← Back to login
                                </button>
                            </form>
                        )}
                    </Formik>
                </Card>
            </div>
        );
    }

    // ─── Main Login Screen ────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            <SEO title="Safe Login" description="Access your Africa Data Solutions account securely." />
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
                    onSubmit={attemptLogin}
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
