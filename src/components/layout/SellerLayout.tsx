import React from 'react';
import Header from './header';
import Sidebar from './sidebar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar with a fixed width */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header fixed at the top */}
        <Header />
        
        {/* Children content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
