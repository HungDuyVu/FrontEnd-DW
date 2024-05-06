import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './pages/Header';
import Taskbar from './pages/TaskBar';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Header className="bg-gray-800 text-white p-4 text-center" />
      <div className="flex flex-1">
        <Taskbar className="bg-orange-500 text-white p-4 flex-shrink-0 w-1/6" />
        <Outlet />
      </div>
    
    </div>
  );
}

export default App;
