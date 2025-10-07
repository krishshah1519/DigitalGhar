import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../components/api/axiosConfig';
import { FaArrowLeft, FaFileUpload, FaFileAlt, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import DocumentList from '../components/document/DocumentList';
import DocumentUploadForm from '../components/document/DocumentUploadForm';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import EditDocumentModal from '../components/modals/EditDocumentModal'
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
            // We only need two API calls now
            const [folderRes, tagsRes] = await Promise.all([
                api.get(`/folders/${folderId}/`),
                api.get('/tags/')
            ]);
    
            // Use the documents directly from the folder response
            setDocuments(folderRes.data.documents || []);
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