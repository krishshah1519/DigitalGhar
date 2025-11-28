import React from 'react';
import { FaFileAlt, FaEdit, FaTrash, FaDownload, FaSpinner } from 'react-icons/fa'; 
import api from '../api/axiosConfig'; 
import toast from 'react-hot-toast'; 

const DocumentList = ({ documents, allTags, onEdit, onDelete }) => {
    
    
    const handleDownload = async (doc) => {
        const toastId = toast.loading('Decrypting and downloading...');
        try {
            const response = await api.get(`/documents/${doc.id}/download/`, {
                responseType: 'blob', 
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            let filename = doc.name;
            const ext = doc.file.split('.').pop();
            if (ext && !filename.endsWith(`.${ext}`)) {
                filename += `.${ext}`;
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Download complete', { id: toastId });
        } catch (error) {
            console.error("Download error:", error);
            toast.error('Failed to download document', { id: toastId });
        }
    };

    return (
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
                        <button onClick={() => onEdit(doc)} className="icon-button" title="Edit"><FaEdit /></button>
                        <button onClick={() => onDelete(doc)} className="icon-button text-red-500" title="Delete"><FaTrash /></button>
                        
                        <button 
                            onClick={() => handleDownload(doc)} 
                            className="action-button bg-green-600 hover:bg-green-700 text-sm cursor-pointer"
                        >
                            <FaDownload /> Download
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DocumentList;