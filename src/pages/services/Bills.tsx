import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Tv, Zap, Droplets, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getBillProviders, getBillPlans, payBill, type BillProvider, type BillPlan } from '../../../api/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const BillsSchema = Yup.object().shape({
    providerId: Yup.string().required('Provider is required'),
    customerId: Yup.string().required('Customer ID is required'),
    planId: Yup.string().when('serviceType', {
        is: (val: string) => val === 'cable' || val === 'electricity',
        then: (schema) => schema.required('Package is required'),
        otherwise: (schema) => schema.optional(),
    }),
    amount: Yup.number().when('serviceType', {
        is: 'electricity',
        then: (schema) => schema.required('Amount is required').min(100),
        otherwise: (schema) => schema.optional(),
    }),
});

const Bills = () => {
    const { type } = useParams<{ type: string }>();
    const safeType = type || 'cable';
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const getServiceDetails = () => {
        switch (safeType) {
            case 'cable':
                return { title: 'Cable TV Subscription', icon: Tv, label: 'Smartcard/IUC Number', color: 'bg-purple-100 text-purple-600' };
            case 'electricity':
                return { title: 'Electricity Bill', icon: Zap, label: 'Meter Number', color: 'bg-yellow-100 text-yellow-600' };
            case 'water':
                return { title: 'Water Bill', icon: Droplets, label: 'Customer ID', color: 'bg-blue-100 text-blue-600' };
            default:
                return { title: 'Bill Payment', icon: CreditCard, label: 'Customer ID', color: 'bg-gray-100 text-gray-600' };
        }
    };

    const details = getServiceDetails();
    const Icon = details.icon;

    // Fetch Providers
    const { data: providers, isLoading: isLoadingProviders } = useQuery({
        queryKey: ['billProviders', safeType],
        queryFn: async () => {
            const response = await getBillProviders(safeType);
            return response.data;
        },
    });

    const payMutation = useMutation({
        mutationFn: payBill,
        onSuccess: (response) => {
            if (response.success) {
                setSuccess(`${details.title} payment successful!`);
                setError(null);
            } else {
                setError(response.message || 'Payment failed');
            }
        },
        onError: (err: any) => {
            setError(err.message || 'An unexpected error occurred');
        }
    });

    const handlePayment = (values: any) => {
        setSuccess(null);
        setError(null);
        payMutation.mutate({
            serviceType: safeType,
            providerId: values.providerId,
            customerId: values.customerId,
            planId: values.planId,
            amount: values.amount,
        });
    };

    if (isLoadingProviders) {
        return (
            <div className="max-w-xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{safeType} Payment</h1>

            <Card variant="glass" className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{details.title}</h3>
                        <p className="text-sm text-text-secondary">Fast and secure payments</p>
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
                    initialValues={{ providerId: '', customerId: '', planId: '', amount: '', serviceType: safeType }}
                    validationSchema={BillsSchema}
                    onSubmit={handlePayment}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
                        // Dynamically fetch plans when provider is selected
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const { data: plans, isLoading: isLoadingPlans } = useQuery({
                            queryKey: ['billPlans', values.providerId],
                            queryFn: async () => {
                                if (!values.providerId) return [];
                                const response = await getBillPlans(values.providerId);
                                return response.data;
                            },
                            enabled: !!values.providerId,
                        });

                        const selectedPlan = plans?.find((p: BillPlan) => p.id === values.planId);

                        return (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-primary mb-2">Select Provider</label>
                                    <select
                                        name="providerId"
                                        onChange={(e) => {
                                            handleChange(e);
                                            setFieldValue('planId', '');
                                        }}
                                        onBlur={handleBlur}
                                        value={values.providerId}
                                        className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                                    >
                                        <option value="">Select Provider...</option>
                                        {providers?.map((p: BillProvider) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {touched.providerId && errors.providerId && (
                                        <p className="mt-1 text-xs text-red-500">{errors.providerId}</p>
                                    )}
                                </div>

                                <Input
                                    label={details.label}
                                    name="customerId"
                                    placeholder={`Enter ${details.label}`}
                                    leftIcon={<CreditCard size={18} />}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.customerId}
                                    error={touched.customerId ? errors.customerId : undefined}
                                />

                                {values.providerId && (safeType === 'cable' || safeType === 'electricity') && (
                                    <div className="animate-fade-in text-sm">
                                        <label className="block text-sm font-semibold text-text-primary mb-2">
                                            {isLoadingPlans ? 'Loading Packages...' : 'Package/Plan'}
                                        </label>
                                        <select
                                            name="planId"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.planId}
                                            disabled={isLoadingPlans}
                                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm disabled:opacity-50"
                                        >
                                            <option value="">Select Package...</option>
                                            {plans?.map((p: BillPlan) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} {p.amount > 0 ? `- ₦${p.amount.toLocaleString()}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {touched.planId && errors.planId && (
                                            <p className="mt-1 text-xs text-red-500">{errors.planId}</p>
                                        )}
                                    </div>
                                )}

                                {safeType === 'electricity' && (
                                    <Input
                                        label="Amount"
                                        name="amount"
                                        type="number"
                                        placeholder="Min ₦100"
                                        leftIcon={<span className="text-sm font-bold">₦</span>}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.amount}
                                        error={touched.amount ? errors.amount : undefined}
                                    />
                                )}

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-secondary">Total Amount</span>
                                        <span className="text-xl font-bold text-text-primary">
                                            ₦{selectedPlan ? selectedPlan.amount.toLocaleString() : (values.amount ? Number(values.amount).toLocaleString() : '0.00')}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full shadow-lg shadow-primary/20"
                                    isLoading={payMutation.isPending}
                                >
                                    Pay Bill
                                </Button>
                            </form>
                        );
                    }}
                </Formik>
            </Card>
        </div>
    );
};

export default Bills;
