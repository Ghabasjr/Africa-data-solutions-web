import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Wifi, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { getLiveDataPlans, purchaseData, type DataPlan } from '../../../api/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const BuyDataSchema = Yup.object().shape({
    networkId: Yup.number().required('Network is required'),
    planId: Yup.string().required('Data plan is required'),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{11}$/, 'Invalid phone number (11 digits required)'),
});

const BuyData = () => {
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    // Fetch live data plans
    const { data: networks, isLoading } = useQuery({
        queryKey: ['liveDataPlans'],
        queryFn: async () => {
            const response = await getLiveDataPlans();
            return response.data;
        },
    });

    const purchaseMutation = useMutation({
        mutationFn: purchaseData,
        onSuccess: (response) => {
            if (response.success) {
                setSuccess('Data purchase successful!');
                setError(null);
            } else {
                setError(response.message || 'Purchase failed');
            }
        },
        onError: (err: any) => {
            setError(err.message || 'An unexpected error occurred');
        }
    });

    const handlePurchase = (values: any) => {
        setSuccess(null);
        setError(null);
        purchaseMutation.mutate({
            planId: values.planId,
            phoneNumber: values.phoneNumber,
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Buy Data</h1>

            <Card variant="glass" className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Wifi size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Purchase Data Bundle</h3>
                        <p className="text-sm text-text-secondary">Instant delivery to any network</p>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 animate-fade-in">
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-medium">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-shake">
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <Formik
                    initialValues={{ networkId: '', planId: '', phoneNumber: '' }}
                    validationSchema={BuyDataSchema}
                    onSubmit={handlePurchase}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
                        const selectedNetwork = networks?.find(n => n.networkId === Number(values.networkId));
                        const selectedPlan = selectedNetwork?.plans.find(p => p.id === values.planId);

                        return (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-2">Select Network</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {networks?.map((network) => (
                                            <button
                                                key={network.networkId}
                                                type="button"
                                                onClick={() => {
                                                    setFieldValue('networkId', network.networkId);
                                                    setFieldValue('planId', ''); // Reset plan when network changes
                                                }}
                                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${Number(values.networkId) === network.networkId
                                                    ? 'border-primary bg-primary/5 shadow-sm'
                                                    : 'border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                <span className="text-xs font-bold">{network.network}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {touched.networkId && errors.networkId && (
                                        <p className="mt-1 text-xs text-red-500">{errors.networkId}</p>
                                    )}
                                </div>

                                {values.networkId && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-semibold text-text-primary mb-2">Data Plan</label>
                                        <select
                                            name="planId"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.planId}
                                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                                        >
                                            <option value="">Select a plan</option>
                                            {selectedNetwork?.plans.map((plan: DataPlan) => (
                                                <option key={plan.id} value={plan.id}>
                                                    {plan.name} - ₦{Number(plan.price).toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                        {touched.planId && errors.planId && (
                                            <p className="mt-1 text-xs text-red-500">{errors.planId}</p>
                                        )}
                                    </div>
                                )}

                                <Input
                                    label="Phone Number"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="08012345678"
                                    leftIcon={<Smartphone size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.phoneNumber}
                                    error={touched.phoneNumber ? errors.phoneNumber : undefined}
                                />

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-secondary">Amount to Pay</span>
                                        <span className="font-bold text-text-primary">
                                            ₦{selectedPlan ? Number(selectedPlan.price).toLocaleString() : '0.00'}
                                        </span>
                                    </div>
                                    {selectedPlan && (
                                        <div className="text-[10px] text-primary bg-primary/5 px-2 py-1 rounded-md inline-block">
                                            Instant Delivery Guaranteed
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full shadow-lg shadow-primary/20"
                                    isLoading={purchaseMutation.isPending}
                                >
                                    Purchase Data
                                </Button>
                            </form>
                        );
                    }}
                </Formik>
            </Card>
        </div>
    );
};

export default BuyData;
