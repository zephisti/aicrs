import React from 'react';

type PageName = "Dashboard" | "Requisitions" | "Candidates" | "CRSTool" | "Reports" | "Settings";

interface SidebarProps {
  activePage: PageName;
  setActivePage: (page: PageName) => void;
}

const NavItem: React.FC<{
  label: PageName;
  activePage: PageName;
  setActivePage: (page: PageName) => void;
  // Icon?: React.FC<React.SVGProps<SVGSVGElement>>; // For future icon integration
}> = ({ label, activePage, setActivePage /*, Icon */ }) => {
  const isActive = activePage === label;
  return (
    <li>
      <button
        onClick={() => setActivePage(label)}
        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150
                    ${isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'text-secondary-100 hover:bg-secondary-700 hover:text-white'
                    }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* {Icon && <Icon className="h-5 w-5 mr-3" />} */}
        {label === 'CRSTool' ? 'CRS Tool' : label}
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navItems: PageName[] = ["Dashboard", "Requisitions", "Candidates", "CRSTool", "Reports", "Settings"];

  return (
    <aside className="w-64 bg-secondary-800 text-white flex flex-col shadow-lg">
      <div className="px-6 py-4">
        {/* Placeholder for Logo or App Name */}
        <h1 className="text-2xl font-semibold text-white">TalentFlow</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item}
              label={item}
              activePage={activePage}
              setActivePage={setActivePage}
              // Icon={/* Map icons here based on item */}
            />
          ))}
        </ul>
      </nav>
      <div className="px-6 py-4 mt-auto border-t border-secondary-700">
        {/* User profile / logout - placeholder */}
        <p className="text-xs text-secondary-400">User: Recruiter Name</p>
      </div>
    </aside>
  );
};

export default Sidebar;