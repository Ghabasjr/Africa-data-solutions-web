import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { getTransactionByReference, getAirtimeOrderByReference, getBillByReference } from '../../api/api';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    reference: string | null;
    txType?: 'wallet' | 'airtime' | 'bills';
}

const TransactionDetailsModal: React.FC<Props> = ({ isOpen, onClose, reference, txType = 'wallet' }) => {
    const { data: response, isLoading, error } = useQuery<any>({
        queryKey: ['transaction', reference, txType],
        queryFn: (): Promise<any> => {
            if (txType === 'airtime') return getAirtimeOrderByReference(reference!);
            if (txType === 'bills') return getBillByReference(reference!);
            return getTransactionByReference(reference!);
        },
        enabled: !!reference && isOpen,
    });

    if (!isOpen) return null;

    const tx = response?.data;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up relative">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Transaction Details</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {isLoading && (
                        <div className="flex justify-center py-10">
                            <img src="/assets/datalog.png" alt="Loading..." className="h-14 w-14 animate-pulse object-contain" />
                        </div>
                    )}
                    
                    {error && (
                        <div className="text-center py-8 text-red-500">
                            Failed to load transaction details.
                        </div>
                    )}

                    {tx && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    txType === 'bills' ? 'bg-blue-100 text-blue-600'
                                    : txType === 'airtime' || tx.type === 'DEBIT' ? 'bg-red-100 text-red-600'
                                    : 'bg-green-100 text-green-600'
                                }`}>
                                    {txType === 'airtime' || tx.type === 'DEBIT' ? <ArrowUpRight size={32} /> : <ArrowDownLeft size={32} />}
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                                    {txType === 'airtime' || tx.type === 'DEBIT' ? '-' : '+'}₦{Number(tx.amount).toLocaleString()}
                                </h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                                    tx.status === 'COMPLETED' || tx.status === 'successful' || tx.status === 'success'
                                        ? 'bg-green-100 text-green-800'
                                        : tx.status === 'FAILED' || tx.status === 'failed'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {tx.status?.toLowerCase() || 'pending'}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                {txType === 'wallet' && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-semibold text-gray-900">{tx.type}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Description</span>
                                    <span className="font-semibold text-gray-900 text-right max-w-[60%]">
                                        {txType === 'airtime'
                                            ? `Airtime - ${tx.network || ''} ${tx.phone || ''}`.trim()
                                            : txType === 'bills'
                                            ? `${tx.category || 'Bill'} - ${tx.serviceID || ''}`.trim()
                                            : tx.description}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Reference</span>
                                    <span className="font-semibold text-gray-900">{tx.reference}</span>
                                </div>
                                {txType === 'airtime' && tx.phone && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Phone Number</span>
                                        <span className="font-semibold text-gray-900">{tx.phone}</span>
                                    </div>
                                )}
                                {txType === 'airtime' && tx.network && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Network</span>
                                        <span className="font-semibold text-gray-900">{tx.network}</span>
                                    </div>
                                )}
                                {txType === 'bills' && tx.serviceID && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Provider</span>
                                        <span className="font-semibold text-gray-900">{tx.serviceID}</span>
                                    </div>
                                )}
                                {txType === 'bills' && tx.meterNumber && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Meter Number</span>
                                        <span className="font-semibold text-gray-900">{tx.meterNumber}</span>
                                    </div>
                                )}
                                {txType === 'bills' && tx.smartcardNumber && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Smartcard No.</span>
                                        <span className="font-semibold text-gray-900">{tx.smartcardNumber}</span>
                                    </div>
                                )}
                                {txType === 'bills' && tx.token && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Token</span>
                                        <span className="font-semibold text-gray-900 text-right max-w-[60%] break-all">{tx.token}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                
                                {tx.balanceBefore !== undefined && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Balance Before</span>
                                        <span className="font-semibold text-gray-900">₦{Number(tx.balanceBefore).toLocaleString()}</span>
                                    </div>
                                )}
                                {tx.balanceAfter !== undefined && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Balance After</span>
                                        <span className="font-semibold text-gray-900">₦{Number(tx.balanceAfter).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            {tx.metadata && Object.keys(tx.metadata).length > 0 && (
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-2">Additional Info</h4>
                                    {Object.entries(tx.metadata).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="font-semibold text-gray-900 text-right max-w-[60%]">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsModal;
