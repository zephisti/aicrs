import React from 'react';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { CalendarDaysIcon } from './components/icons/CalendarDaysIcon';
import { StarIcon } from './components/icons/StarIcon';
import { LightBulbIcon } from './components/icons/LightBulbIcon';
import { BellIcon } from './components/icons/BellIcon';
import { ArrowRightIcon } from './components/icons/ArrowRightIcon'; // Assuming this will be created

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColorClass?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, bgColorClass = "bg-primary-500" }) => (
  <div className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 text-white ${bgColorClass}`}>
    <div className="flex-shrink-0 p-3 bg-white/20 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  </div>
);

interface ListItemProps {
  primaryText: string;
  secondaryText?: string;
  onClick?: () => void;
  trailingText?: string;
}

const ListItem: React.FC<ListItemProps> = ({ primaryText, secondaryText, onClick, trailingText }) => (
  <li 
    className={`p-4 rounded-lg transition-colors duration-150 ${onClick ? 'hover:bg-secondary-100 cursor-pointer' : 'bg-white'}`}
    onClick={onClick}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="font-semibold text-primary-700">{primaryText}</p>
        {secondaryText && <p className="text-sm text-secondary-500">{secondaryText}</p>}
      </div>
      {trailingText && <p className="text-sm text-secondary-600 font-medium">{trailingText}</p>}
      {onClick && <ArrowRightIcon className="h-5 w-5 text-secondary-400 group-hover:text-primary-500" />}
    </div>
  </li>
);

interface WidgetCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  actionText?: string;
  onActionClick?: () => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, icon, children, actionText, onActionClick }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-primary-700 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      {actionText && onActionClick && (
        <button 
          onClick={onActionClick} 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          {actionText}
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </button>
      )}
    </div>
    {children}
  </div>
);

const DashboardPage: React.FC = () => {
  // Placeholder data
  const openRequisitions = [
    { id: '1', title: 'Software Engineer, Frontend', candidates: 25, avgCrs: 78 },
    { id: '2', title: 'Product Manager, Core Platform', candidates: 12, avgCrs: 85 },
    { id: '3', title: 'UX Designer, Mobile App', candidates: 18, avgCrs: 72 },
  ];

  const highPriorityCandidates = [
    { id: 'c1', name: 'Alice Wonderland', role: 'Software Engineer', reason: 'New - CRS: 92%' },
    { id: 'c2', name: 'Bob The Builder', role: 'Product Manager', reason: 'Feedback Review Needed' },
    { id: 'c3', name: 'Charlie Brown', role: 'UX Designer', reason: 'Top Performer - CRS: 88%' },
  ];

  const nextBestActions = [
    "Review 5 new applicants for 'Software Engineer'.",
    "Follow up with Alice Wonderland for 'Software Engineer'.",
    "Schedule interview for Bob The Builder.",
  ];

  const activityFeed = [
    { id: 'a1', text: "Jane Doe applied for 'Software Engineer, Frontend'.", time: "2m ago" },
    { id: 'a2', text: "Hiring Manager (John Smith) commented on Bob The Builder.", time: "15m ago" },
    { id: 'a3', text: "CRS score generated for 3 candidates in 'UX Designer' pipeline.", time: "1h ago" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary-800 tracking-tight">Recruiter Dashboard</h1>
        <p className="text-secondary-600 mt-1">Welcome back, Recruiter Name! Here's your command center.</p>
      </header>
      
      {/* At-a-Glance Metrics */}
      <section aria-labelledby="metrics-title">
        <h2 id="metrics-title" className="sr-only">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard title="Open Requisitions" value="12" icon={<BriefcaseIcon className="h-8 w-8" />} bgColorClass="bg-primary-600" />
          <MetricCard title="New Candidates Today" value="8" icon={<UsersIcon className="h-8 w-8" />} bgColorClass="bg-teal-500" />
          <MetricCard title="Upcoming Interviews" value="3" icon={<CalendarDaysIcon className="h-8 w-8" />} bgColorClass="bg-amber-500" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Open Requisitions Widget */}
        <div className="lg:col-span-2">
          <WidgetCard 
            title="My Open Requisitions" 
            icon={<BriefcaseIcon className="h-6 w-6 text-primary-700" />}
            actionText="View All"
            onActionClick={() => console.log('View all requisitions')}
          >
            <ul className="space-y-3">
              {openRequisitions.map(req => (
                <ListItem 
                  key={req.id} 
                  primaryText={req.title} 
                  secondaryText={`${req.candidates} candidates`} 
                  trailingText={`Avg CRS: ${req.avgCrs}%`}
                  onClick={() => console.log(`Clicked requisition ${req.id}`)}
                />
              ))}
            </ul>
          </WidgetCard>
        </div>

        {/* High Priority Candidates Widget */}
        <div>
          <WidgetCard 
            title="High Priority Candidates" 
            icon={<StarIcon className="h-6 w-6 text-red-500" />}
            actionText="Review All"
            onActionClick={() => console.log('Review all priority candidates')}
          >
             <ul className="space-y-3">
              {highPriorityCandidates.map(candidate => (
                <ListItem 
                  key={candidate.id} 
                  primaryText={candidate.name} 
                  secondaryText={candidate.role}
                  trailingText={candidate.reason}
                  onClick={() => console.log(`Clicked candidate ${candidate.id}`)}
                />
              ))}
            </ul>
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next Best Actions Widget */}
        <WidgetCard 
          title="Next Best Actions" 
          icon={<LightBulbIcon className="h-6 w-6 text-yellow-500" />}
        >
          <ul className="space-y-3">
            {nextBestActions.map((action, index) => (
               <li key={index} className="p-3 bg-secondary-50 rounded-md">
                 <p className="text-sm text-secondary-700">{action}</p>
               </li>
            ))}
          </ul>
        </WidgetCard>

        {/* Activity Feed Widget */}
        <WidgetCard 
          title="Recent Activity" 
          icon={<BellIcon className="h-6 w-6 text-blue-500" />}
        >
          <ul className="space-y-3">
            {activityFeed.map(activity => (
              <ListItem 
                key={activity.id} 
                primaryText={activity.text} 
                trailingText={activity.time} 
              />
            ))}
          </ul>
        </WidgetCard>
      </div>
    </div>
  );
};

export default DashboardPage;