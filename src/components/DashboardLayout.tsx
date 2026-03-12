import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, Search, Bell } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-800">ADS Web</h1>
                            {/* Updated title to be generic or specific page title if we use context later. 
                                For now "ADS Web" or just generic, actual page title might be needed inside the page content 
                                OR we move title logic here. The design usually has a breadcrumb or title. 
                                The previous Dashboard had "Dashboard". 
                                I'll keep it static "Dashboard" or "Africa Data Solutions" for now, 
                                and pages can have their own headers if needed, 
                                but usually the header bar stays. 
                                I'll use "Dashboard" for now, or maybe make it dynamic later.
                            */}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
