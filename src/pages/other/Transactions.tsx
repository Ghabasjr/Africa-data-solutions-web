import { Card } from '../../components/ui/Card';
import { ArrowUpRight, ArrowDownLeft, Filter, Download } from 'lucide-react';

const TRANSACTIONS = [
    { id: 1, type: 'credit', service: 'Wallet Funding', amount: 50000, date: '2024-03-15 14:30', status: 'success' },
    { id: 2, type: 'debit', service: 'MTN Data Purchase', amount: 2500, date: '2024-03-14 09:15', status: 'success' },
    { id: 3, type: 'debit', service: 'DSTV Subscription', amount: 14500, date: '2024-03-12 18:45', status: 'failed' },
    { id: 4, type: 'debit', service: 'Airtime Purchase', amount: 1000, date: '2024-03-10 11:20', status: 'success' },
    { id: 5, type: 'credit', service: 'Referral Bonus', amount: 500, date: '2024-03-08 16:00', status: 'success' },
];

const Transactions = () => {
    // const [filter, setFilter] = useState('all');

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <Download size={16} />
                        Export
                    </button>
                </div>
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
                            {TRANSACTIONS.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{tx.service}</td>
                                    <td className={`py-4 px-6 font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-500">{tx.date}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${tx.status === 'success' ? 'bg-green-100 text-green-800' :
                                            tx.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Transactions;
