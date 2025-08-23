import React, { useState, useCallback } from 'react';
import api from '../api/axiosConfig';
import { FaFileUpload,  FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';

const DocumentUploadForm = ({ onUpload, isUploading, documentName, setDocumentName, setUploadFile, allTags, selectedUploadTags, setSelectedUploadTags, handleCreateTag }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setUploadFile(file);
            setDocumentName(file.name.split('.').slice(0, -1).join('.'));
        }
    }, [setUploadFile, setDocumentName]);

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={handleDrop}
            className={`bg-gray-800 p-6 rounded-lg mb-8 border-2 border-dashed ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600'} transition-all duration-300`}
        >
            <h2 className="text-2xl font-bold mb-4">Upload New Document</h2>
            {isDragging ? (
                <div className="flex justify-center items-center h-48">
                    <p className="text-lg text-blue-400 font-semibold">Drop file to upload</p>
                </div>
            ) : (
                <form onSubmit={onUpload} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            placeholder="Document Name"
                            className="form-input"
                        />
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setUploadFile(file);
                                    setDocumentName(file.name.split('.').slice(0, -1).join('.'));
                                }
                            }}
                            className="w-full self-center file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                        />
                    </div>
                    <CreatableSelect
                        isMulti
                        options={allTags}
                        value={selectedUploadTags}
                        onChange={setSelectedUploadTags}
                        onCreateOption={handleCreateTag}
                        placeholder="Add or create tags..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                    <button type="submit" className="action-button bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
                        {isUploading ? <FaSpinner className="animate-spin" /> : <FaFileUpload />}
                        {isUploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default DocumentUploadForm;