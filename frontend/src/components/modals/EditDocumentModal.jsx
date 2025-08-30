import React, { useEffect, useState } from 'react';
import {FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';


const EditDocumentModal = ({ isOpen, onClose, onConfirm, doc, allTags }) => {
    const [name, setName] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (doc) {
            setName(doc.name);
            setSelectedTags(doc.tags.map(tagId => allTags.find(t => t.value === tagId)).filter(Boolean));
        }
    }, [doc, allTags]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onConfirm(doc.id, { name, tags: selectedTags.map(t => t.value) });
            onClose();
        } catch (error) {
            // Error toast is handled in the onConfirm function
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit Document</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        placeholder="Document name"
                    />
                    <CreatableSelect
                        isMulti
                        options={allTags}
                        value={selectedTags}
                        onChange={setSelectedTags}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select or create tags..."
                    />
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="action-button bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                            {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDocumentModal;
