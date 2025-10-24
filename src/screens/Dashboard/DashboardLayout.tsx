import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Dashboard/Sidebar';
import Header from '../../components/Dashboard/Header';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
        
        <Header />

        <div className="flex-1 overflow-y-auto">
          <Sidebar />
        </div>

      </div>

      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <Outlet />
      </main>

    </div>
  );
}