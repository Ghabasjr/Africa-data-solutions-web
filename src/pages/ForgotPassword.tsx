
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';

import { forgotPassword } from '../../api/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
});

const ForgotPassword = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (response) => {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Email Sent',
                    text: 'If an account exists with that email, a reset code has been sent.',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    navigate('/reset-password');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: response.message || 'Failed to send reset code',
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

    const handleSubmit = async (values: { email: string }) => {
        mutation.mutate(values);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-center text-3xl font-bold font-display text-gray-900 tracking-tight">
                    Forgot Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email to receive a password reset token.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 sm:px-10">
                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={ForgotPasswordSchema}
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

                                <Button
                                    type="submit"
                                    className="w-full"
                                    isLoading={mutation.isPending}
                                >
                                    Send Reset Token
                                </Button>

                                <div className="text-center mt-4 text-sm">
                                    <span className="text-gray-600">Remembered your password? </span>
                                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                        Sign in
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

export default ForgotPassword;
