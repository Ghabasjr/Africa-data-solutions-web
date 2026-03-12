import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import Swal from 'sweetalert2';

import { registerUser } from '../../api/api';

const SignupSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required').min(6, 'Must be at least 6 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSignup = async (values: any) => {
        setIsLoading(true);
        try {
            const response = await registerUser({
                email: values.email,
                phone: values.phone,
                firstName: values.firstName,
                lastName: values.lastName,
                password: values.password
            });

            if (response.success) {
                const { virtualAccount } = response.data;

                await Swal.fire({
                    title: 'Registration Successful!',
                    html: `
                        <div class="text-left space-y-2">
                            <p>Welcome, <b>${values.firstName}</b>! Your account has been created.</p>
                            ${virtualAccount ? `
                                <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p class="font-bold text-primary mb-2">Virtual Account Assigned:</p>
                                    <p class="text-sm"><b>Bank:</b> ${virtualAccount.bankName}</p>
                                    <p class="text-sm"><b>Account Number:</b> ${virtualAccount.accountNumber}</p>
                                    <p class="text-sm"><b>Account Name:</b> ${virtualAccount.accountName}</p>
                                </div>
                            ` : ''}
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonText: 'Login Now',
                    confirmButtonColor: '#3B82F6',
                    allowOutsideClick: false
                });

                navigate('/login');
            } else {
                Swal.fire({
                    title: 'Registration Failed',
                    text: response.message || 'Registration failed',
                    icon: 'error',
                    confirmButtonColor: '#EF4444'
                });
            }
        } catch (err: any) {
            console.error('Signup error:', err);
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
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />

            <Card variant="glass" className="max-w-lg w-full animate-fade-in relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl primary-gradient mb-4 text-white p-3 shadow-lg shadow-primary/30">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-text-primary">Create Account</h1>
                    <p className="text-text-secondary mt-2">Join Africa Data Solutions today</p>
                </div>


                <Formik
                    initialValues={{ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' }}
                    validationSchema={SignupSchema}
                    onSubmit={handleSignup}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    placeholder="John"
                                    leftIcon={<User size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstName}
                                    error={touched.firstName ? errors.firstName : undefined}
                                />
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    placeholder="Doe"
                                    leftIcon={<User size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lastName}
                                    error={touched.lastName ? errors.lastName : undefined}
                                />
                            </div>

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                leftIcon={<Mail size={18} />}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                error={touched.email ? errors.email : undefined}
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                placeholder="+234..."
                                leftIcon={<Phone size={18} />}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phone}
                                error={touched.phone ? errors.phone : undefined}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    error={touched.password ? errors.password : undefined}
                                />

                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}
                                    error={touched.confirmPassword ? errors.confirmPassword : undefined}
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full shadow-lg shadow-primary/20"
                                    isLoading={isLoading}
                                    rightIcon={!isLoading && <UserPlus size={20} />}
                                >
                                    Create Account
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>

                <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-white/10">
                    <p className="text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:text-blue-600 hover:underline transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Signup;
