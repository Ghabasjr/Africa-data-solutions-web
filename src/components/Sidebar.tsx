import React from 'react';
import {
    LayoutDashboard,
    User,
    Wallet,
    Wifi,
    Phone,
    History,
    CreditCard,
    MoreHorizontal,
    Settings,
    Tag,
    Zap,
    MessageCircle,
    X,
    LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { removeToken, logoutUser } from '../../api/api';
import SidebarItem from './SidebarItem';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const refreshToken = useSelector((state: RootState) => state.user.refreshToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Call the API logout endpoint to invalidate the refresh token server-side
            if (refreshToken) {
                await logoutUser({ refreshToken }).catch(() => {
                    // Silently ignore API errors — still log out locally
                });
            }
        } finally {
            removeToken();
            dispatch(logout());
            navigate('/login');
            setIsLoggingOut(false);
        }
    };

    const userInitial = user?.firstName?.[0]?.toUpperCase() || 'U';

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col h-full
        `}
            >
                {/* Profile Section (Top) */}
                <div className="p-6 border-b border-gray-100 flex flex-col items-center">
                    {/* Close button for mobile inside sidebar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-20 h-20 rounded-full bg-orange-100 overflow-hidden mb-3 border-4 border-orange-50 flex items-center justify-center">
                        <span className="text-3xl font-bold text-orange-600">{userInitial}</span>
                    </div>
                    {user && (
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[160px]">{user.email}</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active onClick={onClose} />

                    <SidebarItem
                        icon={User}
                        label="Account"
                        onClick={onClose}
                        subItems={[
                            { label: 'Profile', path: '/profile' },
                            { label: 'Upgrade Account', path: '/upgrade' },
                            { label: 'KYC', path: '/kyc' },
                            { label: 'Pin Management', path: '/pin-management' },
                            { label: 'Change Password', path: '/change-password' },
                        ]}
                    />

                    <SidebarItem icon={Wallet} label="Fund Wallet" path="/fund-wallet" onClick={onClose} />
                    <SidebarItem icon={Wifi} label="Buy Data" path="/buy-data" onClick={onClose} />
                    <SidebarItem icon={Phone} label="Buy Airtime" path="/buy-airtime" onClick={onClose} />

                    <SidebarItem
                        icon={Zap}
                        label="Bills"
                        onClick={onClose}
                        subItems={[
                            { label: 'Cable TV', path: '/bills/cable' },
                            { label: 'Electricity', path: '/bills/electricity' },
                            { label: 'Water', path: '/bills/water' },
                        ]}
                    />

                    <SidebarItem icon={History} label="Transactions" path="/transactions" onClick={onClose} />
                    <SidebarItem icon={CreditCard} label="Wallet Summary" path="/wallet-summary" onClick={onClose} />

                    <SidebarItem
                        icon={MoreHorizontal}
                        label="Others"
                        onClick={onClose}
                        subItems={[
                            { label: 'Edu Pins', path: '/others/edu-pins' },
                            { label: 'Bulk SMS', path: '/others/bulk-sms' },
                            { label: 'Recharge Pin', path: '/others/recharge-pin' },
                            { label: 'Airtime Swap', path: '/others/airtime-swap' },
                        ]}
                    />

                    <SidebarItem icon={Settings} label="Settings" path="/settings" onClick={onClose} />
                    <SidebarItem icon={Tag} label="Pricing" path="/pricing" onClick={onClose} />
                </nav>

                {/* Footer Section */}
                <div className="p-4 relative mt-auto border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mb-4 disabled:opacity-50"
                    >
                        <LogOut size={20} />
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>

                    <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-green-200 shadow-md">
                            <MessageCircle size={24} />
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-semibold text-gray-800">Message us</span>
                        </div>
                    </div>
                    {/* Creating space for the absolute/floating element */}
                    <div className="h-14"></div>

                    {/* Small branding text */}
                    <div className="mt-2 text-center text-xs text-gray-300">
                        Africa Data Solutions
                    </div>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;
