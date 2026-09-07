import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react';
import { getTransactions, getAirtimeHistory, getBillsHistory } from '../../../api/api';
import TransactionDetailsModal from '../../components/TransactionDetailsModal';

const Transactions = () => {
    const [selectedReference, setSelectedReference] = useState<{ref: string, type: 'wallet'|'airtime'|'bills'} | null>(null);
    const [filterType, setFilterType] = useState<'CREDIT' | 'DEBIT' | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<'WALLET' | 'AIRTIME' | 'BILLS'>('WALLET');

    const { data: response, isLoading: isWalletLoading } = useQuery({
        queryKey: ['transactions', filterType],
        queryFn: () => getTransactions({ type: filterType }),
        enabled: activeTab === 'WALLET',
    });

    const { data: airtimeResponse, isLoading: isAirtimeLoading } = useQuery({
        queryKey: ['airtimeHistory'],
        queryFn: () => getAirtimeHistory(),
        enabled: activeTab === 'AIRTIME',
    });

    const { data: billsResponse, isLoading: isBillsLoading } = useQuery({
        queryKey: ['billsHistory'],
        queryFn: () => getBillsHistory(),
        enabled: activeTab === 'BILLS',
    });

    const getItems = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data.items)) return data.items;
        if (Array.isArray(data.orders)) return data.orders;
        if (Array.isArray(data.transactions)) return data.transactions;
        if (Array.isArray(data.payments)) return data.payments;
        return [];
    };

    const isLoading = activeTab === 'WALLET' ? isWalletLoading : activeTab === 'AIRTIME' ? isAirtimeLoading : isBillsLoading;
    const transactions = activeTab === 'WALLET'
        ? getItems(response?.data)
        : activeTab === 'AIRTIME'
        ? getItems(airtimeResponse?.data)
        : getItems(billsResponse?.data);

    const filters: { label: string; value?: 'CREDIT' | 'DEBIT' }[] = [
        { label: 'All Transactions' },
        { label: 'Credits Only', value: 'CREDIT' },
        { label: 'Debits Only', value: 'DEBIT' },
    ];
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col mb-8 gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('WALLET')}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'WALLET' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            Wallet
                        </button>
                        <button
                            onClick={() => setActiveTab('AIRTIME')}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'AIRTIME' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            Airtime
                        </button>
                        <button
                            onClick={() => setActiveTab('BILLS')}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'BILLS' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                            }`}
                        >
                            Bills
                        </button>
                    </div>
                </div>

                {activeTab === 'WALLET' && (
                    <div className="flex items-center justify-end">
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                            {filters.map((filter) => (
                                <button
                                    key={filter.label}
                                    onClick={() => setFilterType(filter.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        filterType === filter.value
                                            ? 'bg-white text-primary shadow-md scale-105'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx: any) => (
                                    <tr 
                                        key={tx.id || tx._id || tx.reference} 
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedReference({
                                            ref: tx.reference,
                                            type: activeTab === 'WALLET' ? 'wallet' : activeTab === 'AIRTIME' ? 'airtime' : 'bills'
                                        })}
                                    >
                                        <td className="py-4 px-6">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                activeTab === 'WALLET' && tx.type === 'CREDIT'
                                                    ? 'bg-green-100 text-green-600'
                                                    : activeTab === 'BILLS'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {activeTab === 'BILLS'
                                                    ? <Receipt size={16} />
                                                    : activeTab === 'WALLET' && tx.type === 'CREDIT'
                                                    ? <ArrowDownLeft size={16} />
                                                    : <ArrowUpRight size={16} />}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-900">
                                            {activeTab === 'WALLET'
                                                ? (tx.description || tx.metadata?.reason || 'Transaction')
                                                : activeTab === 'AIRTIME'
                                                ? `Airtime - ${tx.network || ''} ${tx.phone || ''}`.trim()
                                                : `${tx.category || 'Bill'} - ${tx.serviceID || tx.providerId || ''}`.trim()}
                                        </td>
                                        <td className={`py-4 px-6 font-bold ${
                                            activeTab === 'WALLET' && tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'
                                        }`}>
                                            {activeTab === 'WALLET' && tx.type === 'CREDIT' ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                                                tx.status === 'COMPLETED' || tx.status === 'successful' || tx.status === 'success'
                                                    ? 'bg-green-100 text-green-800'
                                                    : tx.status === 'FAILED' || tx.status === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {tx.status?.toLowerCase() || 'pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <TransactionDetailsModal 
                isOpen={!!selectedReference} 
                onClose={() => setSelectedReference(null)} 
                reference={selectedReference?.ref || null}
                txType={selectedReference?.type}
            />
        </div>
    );
};

export default Transactions;
