
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Key } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';

import { resetPassword } from '../../api/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    resetToken: Yup.string()
        .required('Reset token is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your password'),
});

const ResetPassword = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: resetPassword,
        onSuccess: (response) => {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset',
                    text: 'Your password has been reset successfully. You can now log in.',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: response.message || 'Failed to reset password',
                    confirmButtonColor: '#ef4444',
                });
            }
        },
        onError: (error: any) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An unexpected error occurred',
                confirmButtonColor: '#ef4444',
            });
        }
    });

    const handleSubmit = async (values: any) => {
        mutation.mutate({
            email: values.email,
            resetToken: values.resetToken,
            newPassword: values.newPassword
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Key className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-center text-3xl font-bold font-display text-gray-900 tracking-tight">
                    Reset Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter the reset token sent to your email along with your new password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 sm:px-10">
                    <Formik
                        initialValues={{ email: '', resetToken: '', newPassword: '', confirmPassword: '' }}
                        validationSchema={ResetPasswordSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <Input
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="johndoe@example.com"
                                    leftIcon={<Mail size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    error={touched.email ? errors.email : undefined}
                                />

                                <Input
                                    label="Reset Token"
                                    name="resetToken"
                                    type="text"
                                    placeholder="Enter your token"
                                    leftIcon={<Key size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.resetToken}
                                    error={touched.resetToken ? errors.resetToken : undefined}
                                />

                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.newPassword}
                                    error={touched.newPassword ? errors.newPassword : undefined}
                                />

                                <Input
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    leftIcon={<Lock size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}
                                    error={touched.confirmPassword ? errors.confirmPassword : undefined}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    isLoading={mutation.isPending}
                                >
                                    Reset Password
                                </Button>

                                <div className="text-center mt-4 text-sm">
                                    <span className="text-gray-600">Back to </span>
                                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </Formik>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
