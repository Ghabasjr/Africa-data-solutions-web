import { Card } from '../../components/ui/Card';
import { Tag } from 'lucide-react';

const Pricing = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Service Pricing</h1>

            <Card className="overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <Tag className="text-blue-600" size={24} />
                    <h2 className="text-lg font-bold text-gray-800">Data Plans (MTN)</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Plan</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Validity</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Price (User)</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Price (Agent)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="py-3 px-6">1GB SME</td>
                                <td className="py-3 px-6">30 Days</td>
                                <td className="py-3 px-6 font-bold">₦260</td>
                                <td className="py-3 px-6 text-blue-600 font-bold">₦250</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-6">2GB SME</td>
                                <td className="py-3 px-6">30 Days</td>
                                <td className="py-3 px-6 font-bold">₦520</td>
                                <td className="py-3 px-6 text-blue-600 font-bold">₦500</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-6">5GB SME</td>
                                <td className="py-3 px-6">30 Days</td>
                                <td className="py-3 px-6 font-bold">₦1300</td>
                                <td className="py-3 px-6 text-blue-600 font-bold">₦1250</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <Tag className="text-green-600" size={24} />
                    <h2 className="text-lg font-bold text-gray-800">Cable TV Discounts</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Provider</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Discount (User)</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Discount (Agent)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr>
                                <td className="py-3 px-6">DSTV</td>
                                <td className="py-3 px-6">0%</td>
                                <td className="py-3 px-6 text-green-600 font-bold">0.5%</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-6">GOTV</td>
                                <td className="py-3 px-6">0%</td>
                                <td className="py-3 px-6 text-green-600 font-bold">0.5%</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-6">Startimes</td>
                                <td className="py-3 px-6">0%</td>
                                <td className="py-3 px-6 text-green-600 font-bold">1.0%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Pricing;
