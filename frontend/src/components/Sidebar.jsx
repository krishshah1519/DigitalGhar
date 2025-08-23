import React, {useState} from 'react';
import {AiOutlineMenu} from 'react-icons/ai'
import links from 'react';

 const Sidebar =({children})=>{
    const [isSidebarOpen, setIsSidebarOpen]= useState(true);

    const toggleSidebar = ()=>{
        setIsSidebarOpen(!isSidebarOpen);
        }
    return(
        <div className="flex h-screen ">
        <aside
        className={`bg-slate-800 shadow-xl  flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'}  flex flex-col`}>
        {isSidebarOpen? (
            <div className="">
            <div >
            <button
            className={`bg-transparent border-none p-4 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer`}
            onClick={toggleSidebar}
            ><AiOutlineMenu/></button>
            </div>
            <div>
            <button className=" p-4 justify-center items-center text-xl">Dashboard</button>
            </div>
            </div>

            ):(
            <button
            className={`bg-transparent border-none  p-4 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer`}
            onClick={toggleSidebar}
            ><AiOutlineMenu/></button>
                )}
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )}

export default Sidebar;