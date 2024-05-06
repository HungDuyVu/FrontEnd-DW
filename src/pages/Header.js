// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-gray-800 text-white p-4 text-center w-full">
      <Link to="/" className="text-white block w-full">
        <h1 className="text-2xl font-bold">DATA WAREHOUSE</h1>
      </Link>
    </div>
  );
};

export default Header;

