import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Tv, Zap, Droplets, CreditCard, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getBillProviders, getBillPlans, payBill, type BillPlan, getElectricityProviders, getTvProviders, getEducationProviders, getServiceVariations, payElectricityBill, verifyMeterNumber, verifySmartcard, payTvSubscription, verifyJambProfile, payEducationBill } from '../../../api/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Smartphone, CheckCircle } from 'lucide-react';
import PinModal from '../../components/PinModal';

const BillsSchema = Yup.object().shape({
    providerId: Yup.string().required('Provider is required'),
    planId: Yup.string().required('Plan/Package is required'),
    customerId: Yup.string().when(['serviceType', 'providerId'], {
        is: (serviceType: string, providerId: string) => serviceType !== 'education' || providerId === 'jamb',
        then: (schema) => schema.required('This field is required'),
        otherwise: (schema) => schema.optional(),
    }),
    amount: Yup.number().when('serviceType', {
        is: (val: string) => ['electricity', 'cable', 'tv', 'education'].includes(val),
        then: (schema) => schema.required('Amount is required').min(100),
        otherwise: (schema) => schema.optional(),
    }),
    phone: Yup.string().when('serviceType', {
        is: (val: string) => ['electricity', 'cable', 'tv', 'education'].includes(val),
        then: (schema) => schema.required('Phone number is required').matches(/^[0-9]{11}$/, 'Invalid phone number'),
        otherwise: (schema) => schema.optional(),
    }),
    quantity: Yup.number().when('serviceType', {
        is: 'education',
        then: (schema) => schema.required('Quantity is required').min(1).max(10),
        otherwise: (schema) => schema.optional(),
    })
});

const Bills = () => {
    const { type } = useParams<{ type: string }>();
    const safeType = type || 'cable';
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isPinModalOpen, setIsPinModalOpen] = React.useState(false);
    const [pendingValues, setPendingValues] = React.useState<any>(null);
    const [verifiedName, setVerifiedName] = React.useState<string | null>(null);
    const [isVerifying, setIsVerifying] = React.useState(false);

    const getServiceDetails = () => {
        switch (safeType) {
            case 'cable':
                return { title: 'Cable TV Subscription', icon: Tv, label: 'Smartcard/IUC Number', color: 'bg-purple-100 text-purple-600' };
            case 'electricity':
                return { title: 'Electricity Bill', icon: Zap, label: 'Meter Number', color: 'bg-yellow-100 text-yellow-600' };
            case 'water':
                return { title: 'Water Bill', icon: Droplets, label: 'Customer ID', color: 'bg-blue-100 text-blue-600' };
            case 'education':
                return { title: 'Education PIN', icon: GraduationCap, label: 'Profile ID (Optional for WAEC)', color: 'bg-indigo-100 text-indigo-600' };
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
            if (safeType === 'electricity') {
                const response = await getElectricityProviders();
                return (response.data as any).providers || response.data;
            }
            if (safeType === 'cable' || safeType === 'tv') {
                const response = await getTvProviders();
                return (response.data as any).providers || response.data;
            }
            if (safeType === 'education') {
                const response = await getEducationProviders();
                return (response.data as any).providers || response.data;
            }
            const response = await getBillProviders(safeType);
            return (response.data as any).providers || response.data;
        },
    });

    const payMutation = useMutation({
        mutationFn: async (values: any) => {
            if (safeType === 'electricity') {
                return payElectricityBill({
                    meterNumber: values.customerId,
                    serviceID: values.providerId,
                    variationCode: values.planId,
                    amount: Number(values.amount),
                    phone: values.phone,
                    pin: values.pin
                } as any);
            }
            if (safeType === 'cable' || safeType === 'tv') {
                return payTvSubscription({
                    smartcardNumber: values.customerId,
                    serviceID: values.providerId,
                    variationCode: values.planId,
                    amount: Number(values.amount),
                    phone: values.phone,
                    subscriptionType: 'change',
                    pin: values.pin
                } as any);
            }
            if (safeType === 'education') {
                return payEducationBill({
                    serviceID: values.providerId,
                    variationCode: values.planId,
                    amount: Number(values.amount) * Number(values.quantity || 1),
                    phone: values.phone,
                    quantity: Number(values.quantity || 1),
                    profileId: values.customerId,
                    pin: values.pin
                } as any);
            }
            return payBill({
                serviceType: safeType,
                providerId: values.providerId,
                customerId: values.customerId,
                planId: values.planId,
                amount: values.amount,
                pin: values.pin
            } as any);
        },
        onSuccess: (response) => {
            setIsPinModalOpen(false);
            if (response.success) {
                setSuccess(`${details.title} payment successful!`);
                setError(null);
            } else {
                setError(response.message || 'Payment failed');
            }
        },
        onError: (err: any) => {
            setIsPinModalOpen(false);
            setError(err.message || 'An unexpected error occurred');
        }
    });

    const handlePayment = (values: any) => {
        setSuccess(null);
        setError(null);
        setPendingValues(values);
        setIsPinModalOpen(true);
    };

    const handlePinSuccess = (_pin: string) => {
        if (!pendingValues) return;
        payMutation.mutate({ ...pendingValues, pin: _pin });
    };

    if (isLoadingProviders) {
        return (
            <div className="max-w-xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
                <img src="/assets/datalog.png" alt="Loading..." className="h-16 w-16 animate-pulse object-contain" />
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
                    initialValues={{ providerId: '', customerId: '', planId: '', amount: '', serviceType: safeType, phone: '', quantity: 1 }}
                    validationSchema={BillsSchema}
                    onSubmit={handlePayment}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
                        // Dynamically fetch plans when provider is selected
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const { data: plans, isLoading: isLoadingPlans } = useQuery({
                            queryKey: ['billPlans', values.providerId, safeType],
                            queryFn: async () => {
                                if (!values.providerId) return [];
                                if (safeType === 'electricity' || safeType === 'cable' || safeType === 'tv' || safeType === 'education') {
                                    const response = await getServiceVariations(values.providerId);
                                    // Map ServiceVariation to BillPlan format to reuse the UI logic
                                    return (response.data.variations || []).map((v: any) => ({
                                        id: v.variation_code,
                                        name: v.name,
                                        amount: Number(v.variation_amount || 0)
                                    }));
                                }
                                const response = await getBillPlans(values.providerId);
                                return (response.data as any).variations || (response.data as any).plans || response.data;
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
                                        {providers?.map((p: any) => (
                                            <option key={p.id} value={p.serviceID || p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    {touched.providerId && errors.providerId && (
                                        <p className="mt-1 text-xs text-red-500">{errors.providerId}</p>
                                    )}
                                    {isLoadingPlans && (
                                        <div className="flex justify-center py-8">
                                            <img src="/assets/datalog.png" alt="Loading..." className="h-12 w-12 animate-pulse object-contain" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <Input
                                                label={details.label}
                                                name="customerId"
                                                placeholder={`Enter ${details.label}`}
                                                leftIcon={<CreditCard size={18} />}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setVerifiedName(null);
                                                }}
                                                onBlur={handleBlur}
                                                value={values.customerId}
                                                error={touched.customerId ? errors.customerId as string : undefined}
                                            />
                                        </div>
                                        {((safeType === 'electricity' || safeType === 'cable' || safeType === 'tv') || (safeType === 'education' && values.providerId === 'jamb')) && values.customerId && values.providerId && values.planId && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mb-[2px] h-[52px] px-6 whitespace-nowrap"
                                                isLoading={isVerifying}
                                                onClick={async () => {
                                                    try {
                                                        setIsVerifying(true);
                                                        setError(null);
                                                        if (safeType === 'electricity') {
                                                            const res = await verifyMeterNumber({
                                                                meterNumber: values.customerId,
                                                                serviceID: values.providerId,
                                                                type: values.planId
                                                            });
                                                            if (res.data?.Customer_Name) {
                                                                setVerifiedName(res.data.Customer_Name);
                                                            } else {
                                                                setError('Meter verification failed. Invalid details.');
                                                            }
                                                        } else if (safeType === 'education') {
                                                            const res = await verifyJambProfile({
                                                                profileId: values.customerId,
                                                                variationCode: values.planId
                                                            });
                                                            if (res.data?.Customer_Name) {
                                                                setVerifiedName(res.data.Customer_Name);
                                                            } else {
                                                                setError('JAMB verification failed.');
                                                            }
                                                        } else {
                                                            const res = await verifySmartcard({
                                                                smartcardNumber: values.customerId,
                                                                serviceID: values.providerId
                                                            });
                                                            if (res.data?.Customer_Name) {
                                                                setVerifiedName(res.data.Customer_Name);
                                                            } else {
                                                                setError('Smartcard verification failed. Invalid details.');
                                                            }
                                                        }
                                                    } catch (err: any) {
                                                        setError(err.message || `Failed to verify ${details.label.toLowerCase()}`);
                                                    } finally {
                                                        setIsVerifying(false);
                                                    }
                                                }}
                                            >
                                                Verify
                                            </Button>
                                        )}
                                    </div>
                                    {verifiedName && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2.5 rounded-xl border border-green-100">
                                            <CheckCircle size={16} />
                                            <span className="font-medium">{verifiedName}</span>
                                        </div>
                                    )}
                                </div>

                                {values.providerId && (
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
                                            <p className="mt-1 text-xs text-red-500">{errors.planId as string}</p>
                                        )}
                                    </div>
                                )}

                                {(safeType === 'electricity' || safeType === 'cable' || safeType === 'tv' || safeType === 'education') && (
                                    <>
                                        {safeType === 'education' && (
                                            <Input
                                                label="Quantity"
                                                name="quantity"
                                                type="number"
                                                placeholder="1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.quantity}
                                                error={touched.quantity ? errors.quantity as string : undefined}
                                                min={1}
                                                max={10}
                                            />
                                        )}
                                        <Input
                                            label="Phone Number"
                                            name="phone"
                                            type="tel"
                                            placeholder="08012345678"
                                            leftIcon={<Smartphone size={18} />}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.phone}
                                            error={touched.phone ? errors.phone as string : undefined}
                                        />
                                        <Input
                                            label={safeType === 'education' ? "Unit Amount" : "Amount"}
                                            name="amount"
                                            type="number"
                                            placeholder="Min ₦100"
                                            leftIcon={<span className="text-sm font-bold">₦</span>}
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            value={values.amount}
                                            error={touched.amount ? errors.amount as string : undefined}
                                            readOnly={!!selectedPlan && selectedPlan.amount > 0}
                                        />
                                    </>
                                )}

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-secondary">Total Amount</span>
                                        <span className="text-xl font-bold text-text-primary">
                                            ₦{selectedPlan && selectedPlan.amount > 0 
                                                ? (selectedPlan.amount * (values.quantity || 1)).toLocaleString() 
                                                : (values.amount ? (Number(values.amount) * (values.quantity || 1)).toLocaleString() : '0.00')}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full shadow-lg shadow-primary/20"
                                    isLoading={payMutation.isPending}
                                    disabled={
                                        (['electricity', 'cable', 'tv'].includes(safeType) && !verifiedName) ||
                                        (safeType === 'education' && values.providerId === 'jamb' && !verifiedName)
                                    }
                                >
                                    Pay Bill
                                </Button>
                            </form>
                        );
                    }}
                </Formik>
            </Card>
            <PinModal 
                isOpen={isPinModalOpen}
                onClose={() => setIsPinModalOpen(false)}
                onSuccess={handlePinSuccess}
                isLoading={payMutation.isPending}
            />
        </div>
    );
};

export default Bills;
