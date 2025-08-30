import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../components/api/axiosConfig';
import { FaFolderPlus, FaSignOutAlt, FaSearch, FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Select from 'react-select';



const FolderModal = ({ isOpen, onClose, onConfirm, folder = null }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && folder) {
            setName(folder.name);
        } else {
            setName('');
        }
        setError('');
    }, [isOpen, folder]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) {
            setError('Folder name cannot be empty.');
            return;
        }
        try {
            await onConfirm(name);
            onClose();
        } catch (err) {
            setError(`Failed to ${folder ? 'update' : 'create'} folder.`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{folder ? 'Edit Folder' : 'Create New Folder'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter folder name"
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="py-2 px-4 rounded bg-blue-600 hover:bg-blue-700">{folder ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="py-2 px-4 rounded bg-gray-600 hover:bg-gray-500">Cancel</button>
                    <button onClick={onConfirm} className="py-2 px-4 rounded bg-red-600 hover:bg-red-700">Confirm</button>
                </div>
            </div>
        </div>
    );
};


const DashboardPage = () => {
    const [folders, setFolders] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [modalState, setModalState] = useState({ type: null, data: null }); // type: 'create', 'edit', 'delete'
    const navigate = useNavigate();

    const fetchFoldersAndTags = async () => {
        try {
            setLoading(true);
            const [foldersRes, tagsRes] = await Promise.all([
                api.get("/folders/"),
                api.get("/tags/")
            ]);
            setFolders(foldersRes.data);
            setTags(tagsRes.data.map(tag => ({ value: tag.id, label: tag.name })));
        } catch (err) {
            toast.error('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoldersAndTags();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearching(true);
        try {
            const tagIds = selectedTags.map(t => t.value).join(',');
            const response = await api.get(`/documents/`, {
                params: { search: searchQuery, tags: tagIds }
            });
            setSearchResults(response.data);
            if (response.data.length === 0) {
                toast.success('No documents found matching your query.');
            }
        } catch (error) {
            toast.error('Search failed.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleCreateFolder = async (name) => {
        await api.post('/folders/', { name });
        toast.success('Folder created successfully!');
        fetchFoldersAndTags();
    };

    const handleUpdateFolder = async (name) => {
        await api.put(`/folders/${modalState.data.id}/`, { name });
        toast.success('Folder updated successfully!');
        fetchFoldersAndTags();
    };

    const handleDeleteFolder = async () => {
        try {
            await api.delete(`/folders/${modalState.data.id}/`);
            toast.success('Folder deleted successfully!');
            setModalState({ type: null, data: null });
            fetchFoldersAndTags();
        } catch (error) {
            toast.error('Failed to delete folder.');
        }
    };

    return (
        <>
            <FolderModal
                isOpen={modalState.type === 'create' || modalState.type === 'edit'}
                onClose={() => setModalState({ type: null, data: null })}
                onConfirm={modalState.type === 'create' ? handleCreateFolder : handleUpdateFolder}
                folder={modalState.data}
            />
            <ConfirmationModal
                isOpen={modalState.type === 'delete'}
                onClose={() => setModalState({ type: null, data: null })}
                onConfirm={handleDeleteFolder}
                title="Delete Folder"
                message={`Are you sure you want to delete the folder "${modalState.data?.name}"? All documents inside will also be deleted.`}
            />
            <div className="container mx-auto px-4 sm:px-4 lg:px-4 py-8">
                <header className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b border-gray-700 pb-6">
                    <div>
                    <h1 className="text-4xl font-bold text-white">Digital Vault</h1>
                    <p className="text-gray-400 mt-1">Organize and manage your digital life.</p>
                    </div>
                    <div className="flex items-center gap-4">

                        <button onClick={() => setModalState({ type: 'create' })} className="action-button bg-blue-600 hover:bg-blue-700">
                            <FaFolderPlus /> New Folder
                        </button>
                    </div>
                </header>

            <div className="mb-10">
                <form onSubmit={handleSearch} className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full p-2 pl-10 border border-gray-600 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <Select
                        isMulti
                        options={tags}
                        onChange={setSelectedTags}
                        placeholder="Filter by tags..."
                        className="react-select-container flex-grow"
                        classNamePrefix="react-select"
                    />
                    <button type="submit" className="action-button bg-green-600 hover:bg-green-700 w-full md:w-auto" disabled={isSearching}>
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

                <h2 className="text-2xl font-semibold mb-6 text-white">{searchResults.length > 0 ? 'Search Results' : 'Your Folders'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {searchResults.length > 0 ? (
                        searchResults.map(doc => (
                            <Link to={`/folder/${doc.folder}`} key={doc.id} className="document-card">
                                <h3 className="text-lg font-semibold truncate">{doc.name}</h3>
                                <p className="text-sm text-gray-400">In folder: {folders.find(f => f.id === doc.folder)?.name}</p>
                            </Link>
                        ))
                    ) : folders.length > 0 ? (
                        folders.map((folder) => (
                            <div key={folder.id} className="folder-card group">
                                <Link to={`/folder/${folder.id}`} className="block flex-grow">
                                    <h3 className="text-xl font-semibold text-white mb-2 truncate">{folder.name}</h3>
                                    <p className="text-gray-400">{folder.documents.length} documents</p>
                                </Link>
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setModalState({ type: 'edit', data: folder })} className="icon-button"><FaEdit /></button>
                                    <button onClick={() => setModalState({ type: 'delete', data: folder })} className="icon-button text-red-500"><FaTrash /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-gray-800 rounded-lg">
                            <p className="text-lg text-gray-400">No folders yet. Create one to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DashboardPage;