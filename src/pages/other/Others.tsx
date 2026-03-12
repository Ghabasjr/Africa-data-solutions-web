import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { GraduationCap, MessageSquare, CreditCard, RefreshCcw } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Others = () => {
    const { type } = useParams<{ type: string }>();

    // Default to 'edu-pins' or handle undefined
    const safeType = type || 'edu-pins';

    const getServiceDetails = () => {
        switch (safeType) {
            case 'edu-pins':
                return { title: 'Education Pins', icon: GraduationCap, label: 'Exam Body', options: ['WAEC', 'NECO', 'NABTEB'] };
            case 'bulk-sms':
                return { title: 'Bulk SMS', icon: MessageSquare, label: 'Sender ID', options: [] };
            case 'recharge-pin':
                return { title: 'Print Recharge Pin', icon: CreditCard, label: 'Network', options: ['MTN', 'Airtel', 'Glo', '9mobile'] };
            case 'airtime-swap':
                return { title: 'Airtime Swap', icon: RefreshCcw, label: 'Network', options: ['MTN', 'Airtel', 'Glo', '9mobile'] };
            default:
                return { title: 'Service', icon: GraduationCap, label: 'Option', options: [] };
        }
    };

    const details = getServiceDetails();
    const Icon = details.icon;

    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{details.title}</h1>

            <Card className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{details.title}</h3>
                        <p className="text-sm text-gray-500">Service Description Placeholder</p>
                    </div>
                </div>

                <form className="space-y-6">
                    {details.options.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{details.label}</label>
                            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                {details.options.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                    )}

                    {safeType === 'bulk-sms' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sender ID</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter Sender Name"
                                    maxLength={11}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32 resize-none"
                                    placeholder="Type your message here..."
                                />
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-600">Total Cost</span>
                        <span className="text-xl font-bold text-gray-900">₦0.00</span>
                    </div>

                    <Button className="w-full justify-center">Proceed</Button>
                </form>
            </Card>
        </div>
    );
};

export default Others;
