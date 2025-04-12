// pages/HomeLayout.jsx
import React from 'react';
import Navbar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20 px-4"> {/* Prevent navbar overlap */}
        <Outlet />
      </div>
    </>
  );
};

export default HomeLayout;
