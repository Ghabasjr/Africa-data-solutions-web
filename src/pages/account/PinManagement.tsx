import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Lock, KeyRound } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { createPin, changePin } from '../../../api/api';

const CreatePinSchema = Yup.object().shape({
    pin: Yup.string()
        .matches(/^[0-9]{4}$/, 'PIN must be exactly 4 digits')
        .required('PIN is required'),
});

const ChangePinSchema = Yup.object().shape({
    currentPin: Yup.string()
        .matches(/^[0-9]{4}$/, 'Current PIN must be exactly 4 digits')
        .required('Current PIN is required'),
    newPin: Yup.string()
        .matches(/^[0-9]{4}$/, 'New PIN must be exactly 4 digits')
        .required('New PIN is required'),
    confirmNewPin: Yup.string()
        .oneOf([Yup.ref('newPin')], 'New PINs must match')
        .required('Please confirm your new PIN'),
});

const PinManagement = () => {
    // Mode can be 'create' or 'change'
    const [mode, setMode] = useState<'create' | 'change'>('change');

    const createMutation = useMutation({
        mutationFn: createPin,
        onSuccess: (response) => {
            if (response.success) {
                Swal.fire('Success', 'Transaction PIN created successfully!', 'success');
                setMode('change');
            } else {
                Swal.fire('Error', response.message || 'Failed to create PIN', 'error');
            }
        },
        onError: (err: any) => {
            Swal.fire('Error', err.message || 'An unexpected error occurred', 'error');
        }
    });

    const changeMutation = useMutation({
        mutationFn: changePin,
        onSuccess: (response) => {
            if (response.success) {
                Swal.fire('Success', 'Transaction PIN changed successfully!', 'success');
            } else {
                Swal.fire('Error', response.message || 'Failed to change PIN', 'error');
            }
        },
        onError: (err: any) => {
            Swal.fire('Error', err.message || 'An unexpected error occurred', 'error');
        }
    });

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 font-display">Transaction PIN</h1>

            <div className="flex gap-4 mb-6">
                <Button
                    variant={mode === 'change' ? 'primary' : 'outline'}
                    onClick={() => setMode('change')}
                    className="flex-1"
                >
                    Change PIN
                </Button>
                <Button
                    variant={mode === 'create' ? 'primary' : 'outline'}
                    onClick={() => setMode('create')}
                    className="flex-1"
                >
                    Create PIN
                </Button>
            </div>

            <Card className="p-8">
                <div className="flex items-center gap-4 mb-8 bg-blue-50 p-4 rounded-lg">
                    {mode === 'create' ? <KeyRound className="text-blue-600" size={24} /> : <Lock className="text-blue-600" size={24} />}
                    <p className="text-sm text-blue-800">
                        {mode === 'create'
                            ? "Create a 4-digit transaction PIN. This PIN is required to authorize all transfers and bill payments. Keep it safe."
                            : "Update your existing 4-digit transaction PIN. Keep it safe."}
                    </p>
                </div>

                {mode === 'create' ? (
                    <Formik
                        initialValues={{ pin: '' }}
                        validationSchema={CreatePinSchema}
                        onSubmit={(values, { resetForm }) => {
                            createMutation.mutate({ pin: values.pin }, { onSuccess: () => resetForm() });
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Create 4-digit PIN"
                                    name="pin"
                                    type="password"
                                    maxLength={4}
                                    placeholder="••••"
                                    leftIcon={<KeyRound size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.pin}
                                    error={touched.pin ? errors.pin : undefined}
                                />
                                <Button type="submit" className="w-full" isLoading={createMutation.isPending}>
                                    Create PIN
                                </Button>
                            </form>
                        )}
                    </Formik>
                ) : (
                    <Formik
                        initialValues={{ currentPin: '', newPin: '', confirmNewPin: '' }}
                        validationSchema={ChangePinSchema}
                        onSubmit={(values, { resetForm }) => {
                            changeMutation.mutate({ currentPin: values.currentPin, newPin: values.newPin }, { onSuccess: () => resetForm() });
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Current PIN"
                                    name="currentPin"
                                    type="password"
                                    maxLength={4}
                                    placeholder="••••"
                                    leftIcon={<Lock size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.currentPin}
                                    error={touched.currentPin ? errors.currentPin : undefined}
                                />
                                <Input
                                    label="New PIN"
                                    name="newPin"
                                    type="password"
                                    maxLength={4}
                                    placeholder="••••"
                                    leftIcon={<KeyRound size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.newPin}
                                    error={touched.newPin ? errors.newPin : undefined}
                                />
                                <Input
                                    label="Confirm New PIN"
                                    name="confirmNewPin"
                                    type="password"
                                    maxLength={4}
                                    placeholder="••••"
                                    leftIcon={<KeyRound size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmNewPin}
                                    error={touched.confirmNewPin ? errors.confirmNewPin : undefined}
                                />
                                <Button type="submit" className="w-full" isLoading={changeMutation.isPending}>
                                    Update PIN
                                </Button>
                            </form>
                        )}
                    </Formik>
                )}
            </Card>
        </div>
    );
};

export default PinManagement;
