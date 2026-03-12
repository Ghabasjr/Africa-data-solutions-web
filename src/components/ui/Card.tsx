import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outlined';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        const variants = {
            default: 'bg-white dark:bg-gray-900 border border-transparent shadow-md',
            glass: 'bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/20 shadow-lg',
            outlined: 'bg-transparent border border-gray-200 dark:border-white/10',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-3xl p-6 transition-all duration-300',
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export { Card };
