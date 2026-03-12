import { Card } from '../../components/ui/Card';
import { ArrowUpRight, ArrowDownLeft, Wallet, PieChart } from 'lucide-react';

const WalletSummary = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Wallet Summary</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-blue-600 text-white">
                    <p className="text-blue-100 mb-1">Total Balance</p>
                    <h2 className="text-3xl font-bold mb-4">₦25,450.00</h2>
                    <div className="flex items-center text-sm text-blue-100 bg-blue-500/30 rounded-lg p-2 w-fit">
                        <Wallet size={16} className="mr-2" />
                        Main Wallet
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500">Total Funded</p>
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <ArrowDownLeft size={20} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">₦1,250,000.00</h2>
                    <p className="text-xs text-green-600 flex items-center mt-2">
                        <ArrowUpRight size={12} className="mr-1" />
                        +15% this month
                    </p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-500">Total Spent</p>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">₦980,500.00</h2>
                    <p className="text-xs text-red-600 flex items-center mt-2">
                        <ArrowUpRight size={12} className="mr-1" />
                        +5% this month
                    </p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 h-64 flex flex-col items-center justify-center border-dashed border-2">
                    <PieChart size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500">Spending Analysis Chart Placeholder</p>
                </Card>
                <Card className="p-6 h-64 flex flex-col items-center justify-center border-dashed border-2">
                    <PieChart size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500">Funding Analysis Chart Placeholder</p>
                </Card>
            </div>
        </div>
    );
};

export default WalletSummary;
