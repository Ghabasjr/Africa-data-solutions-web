import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { changePassword } from '../../../api/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters')
        .notOneOf([Yup.ref('currentPassword')], 'New password cannot be the same as current'),
    confirmPassword: Yup.string()
        .required('Please confirm your new password')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

const ChangePassword = () => {
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const changeMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: (response) => {
            if (response.success) {
                setSuccess('Password changed successfully!');
                setError(null);
            } else {
                setError(response.message || 'Failed to change password');
            }
        },
        onError: (err: any) => {
            setError(err.message || 'An unexpected error occurred');
        }
    });

    const handleUpdate = (values: any) => {
        setSuccess(null);
        setError(null);
        changeMutation.mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        });
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 font-display">Change Password</h1>

            <Card variant="glass" className="p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl primary-gradient flex items-center justify-center text-white shadow-lg mx-auto mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <p className="text-sm text-text-secondary">Ensure your account is secure by using a strong, unique password.</p>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 animate-fade-in shadow-sm">
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-medium">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-shake shadow-sm">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <Formik
                    initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                    validationSchema={ChangePasswordSchema}
                    onSubmit={handleUpdate}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Current Password"
                                name="currentPassword"
                                type="password"
                                placeholder="••••••••"
                                leftIcon={<Lock size={18} />}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.currentPassword}
                                error={touched.currentPassword ? errors.currentPassword : undefined}
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
                                className="w-full shadow-lg shadow-primary/20"
                                isLoading={changeMutation.isPending}
                            >
                                Update Password
                            </Button>
                        </form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default ChangePassword;
