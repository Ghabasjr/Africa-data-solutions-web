import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Moon, Lock, Globe, LogOut } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <Bell className="text-gray-500" size={20} />
                                <div>
                                    <p className="font-medium text-gray-900">Push Notifications</p>
                                    <p className="text-xs text-gray-500">Receive alerts about transactions and promos</p>
                                </div>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-green-500 rounded-full cursor-pointer">
                                <span className="absolute left-6 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out"></span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <Moon className="text-gray-500" size={20} />
                                <div>
                                    <p className="font-medium text-gray-900">Dark Mode</p>
                                    <p className="text-xs text-gray-500">Switch to dark theme</p>
                                </div>
                            </div>
                            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out"></span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <Globe className="text-gray-500" size={20} />
                                <div>
                                    <p className="font-medium text-gray-900">Language</p>
                                    <p className="text-xs text-gray-500">Select your preferred language</p>
                                </div>
                            </div>
                            <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm p-2">
                                <option>English</option>
                                <option>French</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Security</h3>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <Lock className="text-gray-500" size={20} />
                            <div>
                                <p className="font-medium text-gray-900">Biometric Login</p>
                                <p className="text-xs text-gray-500">Use fingerprint or face ID to login</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer">
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out"></span>
                        </div>
                    </div>
                </Card>

                <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">
                    <LogOut size={18} className="mr-2" />
                    Log Out
                </Button>
            </div>
        </div>
    );
};

export default Settings;
