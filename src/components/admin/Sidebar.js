import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <ul className="space-y-4">
        <li>
          <Link to="/" className="block p-2 rounded hover:bg-gray-700">Dashboard</Link>
        </li>
        <li>
          <Link to="/land-lord-list" className="block p-2 rounded hover:bg-gray-700">Land Lord List</Link>
        </li>
        <li>
          <Link to="/statistics" className="block p-2 rounded hover:bg-gray-700">Statistics</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
