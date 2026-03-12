import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { useQuery } from '@tanstack/react-query';
import { getMe, getVirtualAccounts, type User } from '../../api/api';
import { setUser } from '../store';
import {
    Eye,
    EyeOff,
    Wallet,
    Users,
    Wifi,
    Phone,
    Tv,
    Zap,
    GraduationCap,
    MessageSquare,
    CreditCard,
    RefreshCcw,
    Gift,
    Copy,
    History,
    ChevronRight,
} from 'lucide-react';

const SERVICES = [
    { icon: Wifi, label: 'Data', type: 'data', color: 'bg-blue-100 text-blue-600' },
    { icon: Phone, label: 'Airtime', type: 'airtime', color: 'bg-green-100 text-green-600' },
    { icon: Tv, label: 'Cable', type: 'cable', color: 'bg-purple-100 text-purple-600' },
    { icon: Zap, label: 'Electricity', type: 'electricity', color: 'bg-yellow-100 text-yellow-600' },
    { icon: GraduationCap, label: 'Edu Pins', type: 'edu-pins', color: 'bg-red-100 text-red-600' },
    { icon: MessageSquare, label: 'Bulk SMS', type: 'bulk-sms', color: 'bg-indigo-100 text-indigo-600' },
    { icon: CreditCard, label: 'Recharge Pin', type: 'recharge-pin', color: 'bg-cyan-100 text-cyan-600' },
    { icon: RefreshCcw, label: 'Airtime Swap', type: 'airtime-swap', color: 'bg-orange-100 text-orange-600' },
    { icon: Gift, label: 'Smile', type: 'smile', color: 'bg-pink-100 text-pink-600' },
];

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.user) as User | null;
    const [showBalance, setShowBalance] = React.useState(false);

    // Fetch user profile
    useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const response = await getMe();
            if (response.success) {
                dispatch(setUser(response.data));
            }
            return response.data;
        },
    });

    // Fetch virtual accounts
    const { data: virtualAccounts } = useQuery({
        queryKey: ['virtualAccounts'],
        queryFn: async () => {
            const response = await getVirtualAccounts();
            return response.data;
        },
    });

    const activeAccount = virtualAccounts?.[0];
    const balance = user?.wallet?.balance ?? 0;
    const currency = user?.wallet?.currency ?? '₦';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.firstName || 'User'} 👋</h1>
                <p className="text-gray-500">Here's what's happening today.</p>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 primary-gradient rounded-3xl p-8 text-white shadow-xl relative overflow-hidden animate-fade-in">
                    <div className="relative z-10">
                        <p className="text-blue-100 mb-1">Available Balance</p>
                        <div className="flex items-center gap-4 mb-8">
                            <h3 className="text-4xl font-bold">
                                {showBalance ? `${currency}${balance.toLocaleString()}` : `${currency}******`}
                            </h3>
                            <button onClick={() => setShowBalance(!showBalance)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                                {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/fund-wallet')}
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-all w-full sm:w-auto"
                            >
                                <Wallet size={18} />
                                Fund Wallet
                            </button>
                            <button className="bg-blue-500/50 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 border border-white/20 hover:bg-blue-500/60 transition-all w-full sm:w-auto">
                                <Users size={18} />
                                Referrals
                            </button>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Virtual Account</h4>
                        <p className="text-xs text-gray-500 mb-6">Create or update your virtual account as required by CBN</p>
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                            <p className="text-xs text-blue-600 font-medium mb-1">{activeAccount?.bankName || 'Virtual Bank'}</p>
                            <p className="text-sm font-bold text-gray-900 mb-2">{activeAccount?.accountName || 'Africa Data Solutions'}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-mono font-bold tracking-wider">{activeAccount?.accountNumber || '0000000000'}</span>
                                <button
                                    onClick={() => activeAccount && navigator.clipboard.writeText(activeAccount.accountNumber)}
                                    className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button className="mt-4 text-sm text-blue-600 font-semibold flex items-center justify-center gap-1 hover:underline">
                        Manage Accounts <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Services Grid */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Our Services</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {SERVICES.map((service, index) => (
                        <div
                            key={service.label}
                            onClick={() => {
                                if (service.type === 'data') navigate('/buy-data');
                                else if (service.type === 'airtime') navigate('/buy-airtime');
                                else if (['cable', 'electricity', 'edu-pins'].includes(service.type)) navigate(`/bills/${service.type}`);
                                else navigate(`/others/${service.type}`);
                            }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group animate-fade-in"
                            style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                        >
                            <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <service.icon size={24} />
                            </div>
                            <p className="font-semibold text-gray-800 text-sm">{service.label}</p>
                            <p className="text-xs text-gray-500 mt-1">Instant Delivery</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="text-sm text-blue-600 font-semibold hover:underline"
                    >
                        View All
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <History size={32} />
                    </div>
                    <p>No recent transactions yet</p>
                    <p className="text-sm">Your activities will appear here</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
