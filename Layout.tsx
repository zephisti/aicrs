
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CrsToolPage from './CrsToolPage';
import DashboardPage from './DashboardPage';
import RequisitionsPage from './RequisitionsPage';
import CandidatesPage from './CandidatesPage'; // New import
// etc.

type PageName = "Dashboard" | "Requisitions" | "Candidates" | "CRSTool" | "Reports" | "Settings";

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 bg-white rounded-lg shadow-md">
    <h1 className="text-3xl font-bold text-primary-700">{title}</h1>
    <p className="mt-4 text-secondary-600">This page is under construction. Coming soon!</p>
  </div>
);


const Layout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageName>('Dashboard'); // Default to Dashboard

  const renderPage = () => {
    switch (currentPage) {
      case 'CRSTool':
        return <CrsToolPage />;
      case 'Dashboard':
        return <DashboardPage />;
      case 'Requisitions':
        return <RequisitionsPage />;
      case 'Candidates':
        return <CandidatesPage />; // Render CandidatesPage
      case 'Reports':
        return <PlaceholderPage title="Reports" />;
      case 'Settings':
        return <PlaceholderPage title="Settings" />;
      default:
        return <DashboardPage />; // Default to Dashboard
    }
  };

  return (
    <div className="flex h-screen bg-secondary-200">
      <Sidebar activePage={currentPage} setActivePage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Optional: Add a global header for TalentFlow here if needed, above renderPage() */}
        {renderPage()}
      </main>
    </div>
  );
};

export default Layout;
