import React, { useState, useRef, useEffect } from 'react';
import { KeyRound, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { createPin } from '../../api/api';
import Swal from 'sweetalert2';

interface CreatePinModalProps {
    isOpen: boolean;
    onClose?: () => void;
    onSuccess: () => void;
    canSkip?: boolean;
}

export const CreatePinModal: React.FC<CreatePinModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    canSkip = true,
}) => {
    const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
    const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '', '', '']);
    const [showPin, setShowPin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const pinRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const confirmRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    useEffect(() => {
        if (isOpen) {
            setPin(['', '', '', '', '', '']);
            setConfirmPin(['', '', '', '', '', '']);
            setError(null);
            setShowPin(false);
            setTimeout(() => pinRefs[0].current?.focus(), 150);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePinChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);
        setError(null);

        // Auto-advance to next input
        if (value && index < 5) {
            pinRefs[index + 1].current?.focus();
        } else if (value && index === 5) {
            // Auto focus confirm pin first slot
            confirmRefs[0].current?.focus();
        }
    };

    const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            pinRefs[index - 1].current?.focus();
        }
    };

    const handleConfirmChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newConfirm = [...confirmPin];
        newConfirm[index] = value.slice(-1);
        setConfirmPin(newConfirm);
        setError(null);

        // Auto-advance to next input
        if (value && index < 5) {
            confirmRefs[index + 1].current?.focus();
        }
    };

    const handleConfirmKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !confirmPin[index] && index > 0) {
            confirmRefs[index - 1].current?.focus();
        }
    };

    const pinStr = pin.join('');
    const confirmPinStr = confirmPin.join('');
    const isPinComplete = pinStr.length === 6;
    const isConfirmComplete = confirmPinStr.length === 6;
    const pinsMatch = isPinComplete && isConfirmComplete && pinStr === confirmPinStr;

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (pinStr.length !== 6) {
            setError('Please enter a complete 6-digit PIN');
            return;
        }

        if (confirmPinStr.length !== 6) {
            setError('Please confirm your 6-digit PIN');
            return;
        }

        if (pinStr !== confirmPinStr) {
            setError('PINs do not match. Please verify and try again.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await createPin({ pin: pinStr });
            if (response.success) {
                // Remove pending flag from session
                sessionStorage.removeItem('pendingPinSetup');

                await Swal.fire({
                    title: 'PIN Created Successfully!',
                    text: response.message || 'Your 6-digit transaction PIN is active. Keep it secret and secure.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });

                onSuccess();
            } else {
                setError(response.message || 'Failed to create transaction PIN.');
            }
        } catch (err: any) {
            console.error('Error creating PIN:', err);
            setError(err.message || 'An error occurred while creating your PIN. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        sessionStorage.removeItem('pendingPinSetup');
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-surface border border-white/20 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 relative overflow-hidden animate-slide-up text-text-primary">
                {/* Background decorative glow */}
                <div className="absolute top-[-30%] right-[-20%] w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-30%] left-[-20%] w-48 h-48 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

                {/* Header */}
                <div className="text-center mb-6 relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl primary-gradient text-white shadow-lg shadow-primary/30 mb-3 transform hover:scale-105 transition-transform duration-300">
                        <KeyRound size={28} />
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-text-primary">
                        Set Transaction PIN
                    </h2>
                    <p className="text-sm text-text-secondary mt-1 max-w-sm mx-auto">
                        Create a secure 6-digit transaction PIN. This PIN will be required to authorize airtime, data purchases, and bill payments.
                    </p>
                </div>

                {/* Mask Toggle */}
                <div className="flex justify-end mb-4 relative z-10">
                    <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors focus:outline-none"
                    >
                        {showPin ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span>{showPin ? 'Hide Digits' : 'Show Digits'}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {/* Enter PIN */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                            Enter 6-Digit PIN
                        </label>
                        <div className="flex justify-between gap-2 sm:gap-3">
                            {pin.map((digit, idx) => (
                                <input
                                    key={`pin-${idx}`}
                                    ref={pinRefs[idx]}
                                    type={showPin ? 'text' : 'password'}
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handlePinChange(idx, e.target.value)}
                                    onKeyDown={(e) => handlePinKeyDown(idx, e)}
                                    disabled={isLoading}
                                    className={`w-11 h-13 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all outline-none bg-background text-text-primary ${
                                        digit
                                            ? 'border-primary shadow-sm shadow-primary/20'
                                            : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/15'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Confirm PIN */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                                Confirm 6-Digit PIN
                            </label>
                            {pinsMatch && (
                                <span className="inline-flex items-center gap-1 text-xs text-green-500 font-medium">
                                    <CheckCircle2 size={13} /> Matches
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between gap-2 sm:gap-3">
                            {confirmPin.map((digit, idx) => (
                                <input
                                    key={`confirm-${idx}`}
                                    ref={confirmRefs[idx]}
                                    type={showPin ? 'text' : 'password'}
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleConfirmChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleConfirmKeyDown(idx, e)}
                                    disabled={isLoading}
                                    className={`w-11 h-13 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all outline-none bg-background text-text-primary ${
                                        digit
                                            ? pinsMatch
                                                ? 'border-green-500 shadow-sm shadow-green-500/20'
                                                : 'border-primary shadow-sm shadow-primary/20'
                                            : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/15'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs animate-shake">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Security Tip */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs text-text-secondary">
                        <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                        <span>Avoid predictable patterns like <code>123456</code> or repeated digits like <code>000000</code>.</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        <Button
                            type="submit"
                            className="w-full shadow-lg shadow-primary/25"
                            isLoading={isLoading}
                            disabled={!isPinComplete || !isConfirmComplete}
                        >
                            Create Transaction PIN
                        </Button>

                        {canSkip && (
                            <button
                                type="button"
                                onClick={handleSkip}
                                disabled={isLoading}
                                className="w-full text-center text-xs text-text-secondary hover:text-text-primary transition-colors py-2"
                            >
                                Skip for now, I'll set it up later
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePinModal;
