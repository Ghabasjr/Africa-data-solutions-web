import React, { useState, useRef, useEffect } from 'react';
import { X, Lock } from 'lucide-react';

interface PinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (pin: string) => void;
    title?: string;
    isLoading?: boolean;
    length?: number;
}

const PinModal: React.FC<PinModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    title = "Enter Transaction PIN",
    isLoading,
    length = 6,
}) => {
    const [pin, setPin] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setPin(Array(length).fill(''));
            setTimeout(() => inputRefs.current[0]?.focus(), 120);
        }
    }, [isOpen, length]);

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        // Move to next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit if all digits filled
        if (newPin.every((digit) => digit !== '') && (index === length - 1 || newPin.join('').length === length)) {
            setTimeout(() => onSuccess(newPin.join('')), 180);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.slice(0, length).split('');
            const newPin = [...pin];
            digits.forEach((d, i) => {
                newPin[i] = d;
            });
            setPin(newPin);
            if (digits.length === length) {
                setTimeout(() => onSuccess(newPin.join('')), 180);
            } else {
                inputRefs.current[digits.length]?.focus();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up relative">
                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Lock size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 sm:p-8">
                    <p className="text-sm text-center text-gray-500 mb-6">
                        Please enter your {length}-digit transaction PIN to authorize this request.
                    </p>

                    <div className="flex justify-center gap-2 sm:gap-3 mb-8" onPaste={handlePaste}>
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="password"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={isLoading}
                                className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold bg-gray-50 border-2 rounded-2xl transition-all outline-none focus:ring-4 focus:ring-primary/10 ${
                                    digit ? 'border-primary' : 'border-gray-200 focus:border-primary'
                                }`}
                            />
                        ))}
                    </div>

                    {isLoading && (
                        <div className="flex flex-col items-center gap-3 py-4 animate-fade-in">
                            <img src="/assets/datalog.png" alt="Loading..." className="h-10 w-10 animate-pulse object-contain" />
                            <span className="text-xs font-medium text-gray-500">Processing transaction...</span>
                        </div>
                    )}

                    {!isLoading && (
                        <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-semibold">
                            Secure Authentication
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PinModal;
