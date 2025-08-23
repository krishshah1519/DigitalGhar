import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
