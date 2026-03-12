import { useState } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubItem {
    label: string;
    path: string;
}

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    path?: string;
    subItems?: SubItem[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active = false, path, subItems }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasSubItems = subItems && subItems.length > 0;

    const toggleExpand = (e: React.MouseEvent) => {
        if (hasSubItems) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    };

    const content = (
        <>
            <div
                onClick={hasSubItems ? toggleExpand : undefined}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{label}</span>
                </div>
                {hasSubItems && (
                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={16} />
                    </div>
                )}
            </div>

            {hasSubItems && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="pl-11 pr-2 space-y-1">
                        {subItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="block py-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                - {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );

    if (path && !hasSubItems) {
        return <Link to={path} className="block mb-1">{content}</Link>;
    }

    return <div className="mb-1">{content}</div>;
};

export default SidebarItem;
