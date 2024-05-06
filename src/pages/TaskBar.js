import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaWarehouse } from 'react-icons/fa'; // Import icons

const Taskbar = () => {
  return (
    <div className="bg-orange-500 text-white p-4 flex-shrink-0 w-1/6">
      <Link to="/doanh-thu" className="flex items-center mb-4 bg-white text-blue-500 px-4 py-2 rounded-md text-center">
        <FaChartBar className="mr-2" /> Doanh Thu
      </Link>
      <Link to="/kho" className="flex items-center bg-white text-blue-500 px-4 py-2 rounded-md text-center">
        <FaWarehouse className="mr-2" /> Kho
      </Link>
    </div>
  );
};

export default Taskbar;


