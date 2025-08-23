import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="py-2 px-4 rounded bg-gray-600 hover:bg-gray-500" disabled={isSubmitting}>Cancel</button>
                    <button onClick={handleConfirm} className="action-button bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;