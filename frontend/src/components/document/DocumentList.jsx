import React  from 'react';
import {  FaFileAlt, FaEdit, FaTrash } from 'react-icons/fa';


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

export default DocumentList;
