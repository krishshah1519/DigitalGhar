import React, {useState} from 'react';
import {AiOutlineMenu} from 'react-icons/ai'
import {Link} from 'react-router-dom';

 const Sidebar =({})=>{
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
                <Link to="/dashboard">
                    <button className=" p-4 justify-center items-center text-xl">
                        Dashboard
                    </button>
                </Link>
            </div>
            </div>

            ):(
            <button
            className={`bg-transparent border-none  p-4 text-gray-500 hover:text-gray-700 text-2xl cursor-pointer`}
            onClick={toggleSidebar}
            ><AiOutlineMenu/></button>
                )}
        </aside>
        </div>
    )}

export default Sidebar;