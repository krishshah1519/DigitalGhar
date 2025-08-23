import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../components/api/axiosConfig';
import { FaArrowLeft, FaFileUpload, FaFileAlt, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';

// MODAL COMPONENTS (Ideally, move these to their own files in a 'components/modals' directory)

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

const DocumentList = ({ documents, allTags, onEdit, onDelete }) => (
    <div className="space-y-4">
        {documents.map(doc => (
            <div key={doc.id} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-transform transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                    <span className="text-3xl"><FaFileAlt className="text-gray-500" /></span>
                    <span className="font-semibold">{doc.name}</span>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-grow text-sm text-gray-400">
                        Tags: {doc.tags.map(tagId => allTags.find(t => t.value === tagId)?.label).join(', ')}
                    </div>
                    <button onClick={() => onEdit(doc)} className="icon-button"><FaEdit /></button>
                    <button onClick={() => onDelete(doc)} className="icon-button text-red-500"><FaTrash /></button>
                    <a href={doc.file} target="_blank" rel="noopener noreferrer" download className="action-button bg-green-600 hover:bg-green-700 text-sm">
                        Download
                    </a>
                </div>
            </div>
        ))}
    </div>
);

const EmptyFolderView = () => (
    <div className="text-center py-12 bg-gray-800 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-white">No documents</h3>
        <p className="mt-1 text-sm text-gray-500">This folder is empty. Upload a document to get started.</p>
    </div>
);



const FolderDetailPage = () => {
    const { folderId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [folderName, setFolderName] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [selectedUploadTags, setSelectedUploadTags] = useState([]);
    const [modalState, setModalState] = useState({ type: null, data: null });

    const fetchFolderData = useCallback(async () => {
        try {
            setLoading(true);
            const [docsRes, folderRes, tagsRes] = await Promise.all([
                api.get(`/documents/?folder=${folderId}`),
                api.get(`/folders/${folderId}/`),
                api.get('/tags/')
            ]);
            setDocuments(docsRes.data.results || []);
            setFolderName(folderRes.data.name);
            setAllTags(tagsRes.data.map(t => ({ value: t.id, label: t.name })));
        } catch (err) {
            toast.error('Failed to fetch folder data.');
        } finally {
            setLoading(false);
        }
    }, [folderId]);

    useEffect(() => {
        fetchFolderData();
    }, [fetchFolderData]);

    const handleCreateTag = async (inputValue) => {
        const loadingToast = toast.loading(`Creating tag "${inputValue}"...`);
        try {
            const response = await api.post('/tags/', { name: inputValue });
            const newTag = { value: response.data.id, label: response.data.name };
            setAllTags(prevTags => [...prevTags, newTag]);
            setSelectedUploadTags(prev => [...prev, newTag]);
            toast.success(`Tag "${inputValue}" created!`, { id: loadingToast });
        } catch (error) {
            toast.error('Failed to create tag.', { id: loadingToast });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile || !documentName.trim()) {
            toast.error('Both a file and document name are required.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('name', documentName);
        formData.append('folder', folderId);
        formData.append('file_type', uploadFile.type);
        selectedUploadTags.forEach(tag => formData.append('tags', tag.value));

        try {
            await api.post('/documents/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Document uploaded successfully!');
            setUploadFile(null);
            setDocumentName('');
            setSelectedUploadTags([]);
            fetchFolderData();
        } catch (err) {
            toast.error('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteDocument = async () => {
        await api.delete(`/documents/${modalState.data.id}/`);
        toast.success('Document deleted successfully!');
        fetchFolderData();
    };

    const handleUpdateDocument = async (docId, updatedData) => {
        await api.patch(`/documents/${docId}/`, updatedData);
        toast.success('Document updated!');
        fetchFolderData();
    };

    if (loading) return <p className="text-center mt-8 text-lg">Loading Folder...</p>;

    return (
        <>
            <ConfirmationModal
                isOpen={modalState.type === 'delete_document'}
                onClose={() => setModalState({ type: null, data: null })}
                onConfirm={handleDeleteDocument}
                title="Delete Document"
                message={`Are you sure you want to delete "${modalState.data?.name}"?`}
            />
            <EditDocumentModal
                isOpen={modalState.type === 'edit_document'}
                onClose={() => setModalState({ type: null, data: null })}
                onConfirm={handleUpdateDocument}
                doc={modalState.data}
                allTags={allTags}
            />

            <div className="container mx-auto px-4 py-8">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-400 hover:underline mb-6">
                    <FaArrowLeft />
                    Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold text-white mb-4">Folder: {folderName}</h1>

                <DocumentUploadForm
                    onUpload={handleUpload}
                    isUploading={isUploading}
                    documentName={documentName}
                    setDocumentName={setDocumentName}
                    setUploadFile={setUploadFile}
                    allTags={allTags}
                    selectedUploadTags={selectedUploadTags}
                    setSelectedUploadTags={setSelectedUploadTags}
                    handleCreateTag={handleCreateTag}
                />

                {documents.length > 0 ? (
                    <DocumentList
                        documents={documents}
                        allTags={allTags}
                        onEdit={(doc) => setModalState({ type: 'edit_document', data: doc })}
                        onDelete={(doc) => setModalState({ type: 'delete_document', data: doc })}
                    />
                ) : (
                    <EmptyFolderView />
                )}
            </div>
        </>
    );
};

export default FolderDetailPage;