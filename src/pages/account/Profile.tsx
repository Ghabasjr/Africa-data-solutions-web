import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { User as UserIcon, Mail, Phone, MapPin, Camera, Edit2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import type { RootState } from '../../store';
import { updateProfile } from '../../../api/api';
import { setUser } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{11}$/, 'Invalid phone number (11 digits required)'),
});

const Profile = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = React.useState(false);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (response) => {
            if (response.success) {
                dispatch(setUser(response.data));
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                setError(null);
            } else {
                setError(response.message || 'Update failed');
            }
        },
        onError: (err: any) => {
            setError(err.message || 'An unexpected error occurred');
        }
    });

    const handleUpdate = (values: any) => {
        setSuccess(null);
        setError(null);
        updateMutation.mutate(values);
    };

    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User Name';

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 font-display">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card variant="glass" className="md:col-span-1 p-8 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full primary-gradient flex items-center justify-center border-4 border-white shadow-xl">
                            <span className="text-4xl font-bold text-white tracking-wider">
                                {user?.firstName?.[0]?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <button className="absolute bottom-1 right-1 p-2.5 bg-white text-primary rounded-full shadow-lg hover:bg-gray-50 transition-all border border-gray-100 group">
                            <Camera size={18} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight mb-1">{fullName}</h2>
                    <p className="text-sm text-text-secondary mb-6">{user?.email}</p>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">
                        <CheckCircle2 size={14} className="mr-1.5" />
                        Verified Account
                    </div>
                </Card>

                {/* Details Card */}
                <Card variant="glass" className="md:col-span-2 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">Personal Information</h3>
                            <p className="text-sm text-text-secondary">Update your details anytime</p>
                        </div>
                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="border-primary/20 text-primary hover:bg-primary/5"
                                leftIcon={<Edit2 size={14} />}
                            >
                                Edit Profile
                            </Button>
                        )}
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

                    {isEditing ? (
                        <Formik
                            initialValues={{
                                firstName: user?.firstName || '',
                                lastName: user?.lastName || '',
                                phone: user?.phone || '',
                            }}
                            validationSchema={ProfileSchema}
                            onSubmit={handleUpdate}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Input
                                            label="First Name"
                                            name="firstName"
                                            value={values.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.firstName ? errors.firstName as string : undefined}
                                            leftIcon={<UserIcon size={18} />}
                                        />
                                        <Input
                                            label="Last Name"
                                            name="lastName"
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.lastName ? errors.lastName as string : undefined}
                                            leftIcon={<UserIcon size={18} />}
                                        />
                                    </div>
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.phone ? errors.phone as string : undefined}
                                        leftIcon={<Phone size={18} />}
                                    />
                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="submit"
                                            className="flex-1 shadow-lg shadow-primary/20"
                                            isLoading={updateMutation.isPending}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setIsEditing(false)}
                                            leftIcon={<X size={18} />}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Full Name</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                        <UserIcon size={18} className="text-primary" />
                                        <span className="font-semibold text-text-primary">{fullName}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Email Address</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                        <Mail size={18} className="text-primary" />
                                        <span className="font-semibold text-text-primary">{user?.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Phone Number</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                        <Phone size={18} className="text-primary" />
                                        <span className="font-semibold text-text-primary">{user?.phone}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Location</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                        <MapPin size={18} className="text-primary" />
                                        <span className="font-semibold text-text-primary">Lagos, Nigeria</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="font-bold text-text-primary">Account Tier: Level 1</p>
                                    <p className="text-xs text-text-secondary">Increase your transaction limit by verifying KYC</p>
                                </div>
                                <Button size="sm" className="w-full sm:w-auto shadow-md">
                                    Upgrade Now
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Profile;
