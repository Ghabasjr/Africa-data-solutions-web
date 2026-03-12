import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Upload, FileText } from 'lucide-react';

const KYC = () => {
    const [status] = useState<'pending' | 'verified' | 'unverified'>('unverified');

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">KYC Verification</h1>

            <Card className="p-8">
                {status === 'unverified' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Upload Identification</h3>
                        <p className="text-gray-500 mb-8">Please upload a valid government issued ID (NIN, Passport, Drivers License) to verify your account.</p>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 hover:bg-gray-50 cursor-pointer transition-colors">
                            <FileText className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                        </div>

                        <Button className="w-full">Submit for Verification</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default KYC;
