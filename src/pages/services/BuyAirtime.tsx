import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Phone, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAirtimeNetworks, purchaseAirtime } from '../../../api/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import PinModal from '../../components/PinModal';

const BuyAirtimeSchema = Yup.object().shape({
    network: Yup.string().required('Network is required'),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{11}$/, 'Invalid phone number (11 digits required)'),
    amount: Yup.number()
        .required('Amount is required')
        .min(50, 'Minimum amount is ₦50')
        .max(50000, 'Maximum amount is ₦50,000'),
});

const BuyAirtime = () => {
    const [success, setSuccess] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isPinModalOpen, setIsPinModalOpen] = React.useState(false);
    const [pendingValues, setPendingValues] = React.useState<any>(null);

    // Fetch networks (reusing getAirtimeNetworks)
    const { data: networks, isLoading } = useQuery({
        queryKey: ['airtimeNetworks'],
        queryFn: async () => {
            const response = await getAirtimeNetworks();
            return response.data;
        },
    });

    const networkList: any[] = Array.isArray(networks)
        ? networks
        : Array.isArray((networks as any)?.networks)
        ? (networks as any).networks
        : [];

    const purchaseMutation = useMutation({
        mutationFn: purchaseAirtime,
        onSuccess: (response) => {
            setIsPinModalOpen(false);
            if (response.success) {
                setSuccess('Airtime purchase successful!');
                setError(null);
            } else {
                setError(response.message || 'Purchase failed');
            }
        },
        onError: (err: any) => {
            setIsPinModalOpen(false);
            setError(err.message || 'An unexpected error occurred');
        }
    });

    const handlePurchase = (values: any) => {
        setSuccess(null);
        setError(null);
        setPendingValues(values);
        setIsPinModalOpen(true);
    };

    const handlePinSuccess = (_pin: string) => {
        // Leave the modal open so it displays the loading spinner!
        if (!pendingValues) return;

        purchaseMutation.mutate({
            network: pendingValues.network.toLowerCase(),
            amount: Number(pendingValues.amount),
            phone: pendingValues.phoneNumber,
            pin: _pin,
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
                <img src="/assets/datalog.png" alt="Loading..." className="h-16 w-16 animate-pulse object-contain" />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Buy Airtime</h1>

            <Card variant="glass" className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Purchase Airtime</h3>
                        <p className="text-sm text-text-secondary">Top up any phone number instantly</p>
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
                    initialValues={{ network: '', phoneNumber: '', amount: '' }}
                    validationSchema={BuyAirtimeSchema}
                    onSubmit={handlePurchase}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-2">Select Network</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {networkList.map((network: any) => (
                                        <button
                                            key={network.id}
                                            type="button"
                                            onClick={() => setFieldValue('network', network.id)}
                                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${values.network === network.id
                                                    ? 'border-primary bg-primary/5 shadow-sm'
                                                    : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <span className="text-xs font-bold">{network.name}</span>
                                        </button>
                                    ))}
                                </div>
                                {touched.network && errors.network && (
                                    <p className="mt-1 text-xs text-red-500">{errors.network}</p>
                                )}
                            </div>

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

                            <Input
                                label="Amount"
                                name="amount"
                                type="number"
                                placeholder="Enter amount (₦100 - ₦50,000)"
                                leftIcon={<span className="text-sm font-bold">₦</span>}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.amount}
                                error={touched.amount ? errors.amount : undefined}
                            />

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary">Total Amount</span>
                                    <span className="text-xl font-bold text-text-primary">
                                        ₦{values.amount ? Number(values.amount).toLocaleString() : '0.00'}
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full shadow-lg shadow-primary/20"
                                isLoading={purchaseMutation.isPending}
                            >
                                Buy Airtime
                            </Button>
                        </form>
                    )}
                </Formik>
            </Card>
            <PinModal 
                isOpen={isPinModalOpen}
                onClose={() => setIsPinModalOpen(false)}
                onSuccess={handlePinSuccess}
                isLoading={purchaseMutation.isPending}
            />
        </div>
    );
};

export default BuyAirtime;
