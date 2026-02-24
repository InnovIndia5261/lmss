import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div>
      <Sidebar />
      <div className="ml-[250px] min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
