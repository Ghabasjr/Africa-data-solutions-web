import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Check, Zap, Star, Shield } from 'lucide-react';

const PLANS = [
    {
        name: 'Starter',
        price: 'Free',
        description: 'Perfect for getting started',
        features: ['Basic Transactions', 'Standard Support', '2% Cashback'],
        current: true,
        icon: Zap,
        color: 'text-gray-600',
        Bg: 'bg-gray-100'
    },
    {
        name: 'Pro',
        price: '₦2,000/mo',
        description: 'For power users and businesses',
        features: ['Zero Transaction Fees', 'Priority Support', '5% Cashback', 'API Access', 'Analytics Dashboard'],
        current: false,
        recommended: true,
        icon: Star,
        color: 'text-yellow-600',
        Bg: 'bg-yellow-100'
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations',
        features: ['Dedicated Account Manager', 'Custom Integration', 'Unlimited Users', 'SLA Agreement'],
        current: false,
        icon: Shield,
        color: 'text-blue-600',
        Bg: 'bg-blue-100'
    }
];

const Upgrade = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Upgrade Your Account</h1>
                <p className="text-gray-500 max-w-xl mx-auto">Choose the plan that suits your needs best and enjoy premium benefits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`relative p-8 flex flex-col h-full border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${plan.recommended ? 'border-blue-500 shadow-md scale-105 z-10' : 'border-transparent bg-white shadow-sm'
                            }`}
                    >
                        {plan.recommended && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Recommended
                            </div>
                        )}

                        <div className={`w-12 h-12 rounded-xl ${plan.Bg} flex items-center justify-center mb-6`}>
                            <plan.icon className={plan.color} size={24} />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="mb-4">
                            <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-8">{plan.description}</p>

                        <div className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Check size={12} />
                                    </div>
                                    <span className="text-sm text-gray-600">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            className={`w-full py-6 rounded-xl font-bold ${plan.recommended
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                                : plan.current
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'
                                }`}
                            disabled={plan.current}
                        >
                            {plan.current ? 'Current Plan' : 'Select Plan'}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Upgrade;
