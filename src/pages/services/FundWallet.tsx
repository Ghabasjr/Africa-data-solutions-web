import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CreditCard, Building, Copy } from 'lucide-react';

const FundWallet = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Fund Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bank Transfer */}
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Building size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Bank Transfer</h3>
                            <p className="text-sm text-gray-500">Automated funding via virtual account</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                            <p className="font-bold text-gray-900">9Payment Service Bank</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Account Name</p>
                            <p className="font-bold text-gray-900">Africa Data Solutions</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Account Number</p>
                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">0000 000 000</p>
                                <button className="text-blue-600 hover:text-blue-700">
                                    <Copy size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Card Payment */}
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Card Payment</h3>
                            <p className="text-sm text-gray-500">Fund instantly with your debit card</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Fund</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                                <input
                                    type="number"
                                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <Button className="w-full justify-center">Proceed to Payment</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FundWallet;
