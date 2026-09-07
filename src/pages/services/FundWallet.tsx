import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CreditCard, Building, Copy, CheckCircle, AlertCircle, Plus, RefreshCcw, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { getVirtualAccounts, initiateFunding, createVirtualAccount } from '../../../api/api';

const FUND_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

const FundWallet = () => {
    const [amount, setAmount] = React.useState('');
    const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

    // Load real virtual accounts
    const { data: vaResponse, isLoading: vaLoading, refetch: refetchVA } = useQuery({
        queryKey: ['virtualAccounts'],
        queryFn: () => getVirtualAccounts(),
    });
    const virtualAccounts = vaResponse?.data ?? [];

    // Create virtual account (PalmPay)
    const createVAMutation = useMutation({
        mutationFn: () => createVirtualAccount({ bank: 'PALMPAY' }),
        onSuccess: (res) => {
            if (res.success) {
                Swal.fire('Success', 'Virtual account created successfully!', 'success');
                refetchVA();
            } else {
                Swal.fire('Error', res.message || 'Failed to create virtual account', 'error');
            }
        },
        onError: (err: any) => {
            Swal.fire('Error', err.message || 'An unexpected error occurred', 'error');
        },
    });

    // Initiate card payment via Paystack
    const fundMutation = useMutation({
        mutationFn: (amt: number) => initiateFunding({ amount: amt }),
        onSuccess: (res) => {
            if (res.success && res.data?.authorizationUrl) {
                window.open(res.data.authorizationUrl, '_blank');
            } else {
                Swal.fire('Error', res.message || 'Could not initiate payment', 'error');
            }
        },
        onError: (err: any) => {
            Swal.fire('Error', err.message || 'An unexpected error occurred', 'error');
        },
    });

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const handleFund = () => {
        const amt = parseFloat(amount);
        if (!amt || amt < 100) {
            Swal.fire('Invalid Amount', 'Minimum funding amount is ₦100', 'warning');
            return;
        }
        fundMutation.mutate(amt);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Fund Wallet</h1>
            <p className="text-gray-500 mb-8">Add money to your wallet via bank transfer or card payment.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ── Bank Transfer ── */}
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Building size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Bank Transfer</h3>
                            <p className="text-sm text-gray-500">Send to your virtual account to fund instantly</p>
                        </div>
                    </div>

                    {vaLoading ? (
                        <div className="flex items-center justify-center py-10 text-gray-400">
                            <Loader2 size={28} className="animate-spin mr-2" />
                            <span className="text-sm">Loading accounts...</span>
                        </div>
                    ) : virtualAccounts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                <Building size={24} className="text-blue-400" />
                            </div>
                            <p className="text-sm text-gray-600 mb-1 font-medium">No virtual account yet</p>
                            <p className="text-xs text-gray-400 mb-4">Create one to start receiving transfers</p>
                            <Button
                                onClick={() => createVAMutation.mutate()}
                                isLoading={createVAMutation.isPending}
                                leftIcon={<Plus size={16} />}
                                size="sm"
                            >
                                Create Virtual Account
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {virtualAccounts.map((acct, idx) => (
                                <div key={acct.id ?? idx} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{acct.bankName}</span>
                                        {acct.isActive && (
                                            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Active</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-gray-700 mb-3">{acct.accountName}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-mono font-bold text-gray-900 tracking-wider">{acct.accountNumber}</span>
                                        <button
                                            onClick={() => handleCopy(acct.accountNumber, idx)}
                                            className={`p-2 rounded-lg transition-all ${copiedIdx === idx ? 'text-green-600 bg-green-50' : 'text-blue-600 hover:bg-blue-50'}`}
                                            title="Copy account number"
                                        >
                                            {copiedIdx === idx ? <CheckCircle size={20} /> : <Copy size={20} />}
                                        </button>
                                    </div>
                                    {copiedIdx === idx && <p className="text-xs text-green-600 mt-1">Copied!</p>}
                                </div>
                            ))}

                            <button
                                onClick={() => refetchVA()}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <RefreshCcw size={12} /> Refresh
                            </button>

                            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700">
                                    Transfers reflect within minutes. Use your exact account number to avoid delays.
                                </p>
                            </div>
                        </div>
                    )}
                </Card>

                {/* ── Card Payment ── */}
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Card Payment</h3>
                            <p className="text-sm text-gray-500">Fund instantly with your debit/credit card</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {/* Quick amount buttons */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Select</label>
                            <div className="grid grid-cols-3 gap-2">
                                {FUND_AMOUNTS.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(String(amt))}
                                        className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                                            amount === String(amt)
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
                                        }`}
                                    >
                                        ₦{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                                <input
                                    type="number"
                                    min={100}
                                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Minimum: ₦100</p>
                        </div>

                        <Button
                            className="w-full justify-center"
                            onClick={handleFund}
                            isLoading={fundMutation.isPending}
                            disabled={!amount || parseFloat(amount) < 100}
                        >
                            Proceed to Payment
                        </Button>

                        <p className="text-xs text-center text-gray-400">
                            Powered by <span className="font-semibold text-gray-600">Paystack</span> — secured & encrypted
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FundWallet;
