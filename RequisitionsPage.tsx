
import React, { useState, useCallback } from 'react';
import type { Requisition, RequisitionStatus } from './types';
import { PlusCircleIcon } from './components/icons/PlusCircleIcon';
import { EyeIcon } from './components/icons/EyeIcon';
import { PencilSquareIcon } from './components/icons/PencilSquareIcon';
import { FilterIcon } from './components/icons/FilterIcon';
import { ChevronUpDownIcon } from './components/icons/ChevronUpDownIcon';
import { TextAreaInput } from './components/TextAreaInput'; // Re-use for JD and skills

// Sample Data
const initialRequisitions: Requisition[] = [
  {
    id: 'req1',
    jobTitle: 'Senior Frontend Engineer',
    status: 'Open',
    hiringManager: 'Alice Wonderland',
    location: 'Remote (US)',
    dateCreated: new Date(2023, 10, 15).toISOString(),
    candidateCount: 35,
    averageCrs: 78,
    jobDescription: 'Build amazing user interfaces with React and TypeScript. Lead frontend projects and mentor junior developers.',
    mustHaveSkills: 'React, TypeScript, JavaScript, HTML, CSS, Git',
    niceToHaveSkills: 'Next.js, GraphQL, Tailwind CSS, UI/UX Design Principles',
  },
  {
    id: 'req2',
    jobTitle: 'Product Manager - Core Platform',
    status: 'Open',
    hiringManager: 'Bob The Builder',
    location: 'New York, NY',
    dateCreated: new Date(2023, 9, 20).toISOString(),
    candidateCount: 22,
    averageCrs: 85,
    jobDescription: 'Define and drive the product strategy for our core platform. Work closely with engineering, design, and marketing teams.',
    mustHaveSkills: 'Product Management, Agile, Roadmapping, User Stories, JIRA',
    niceToHaveSkills: 'SaaS, B2B Products, Technical Background, Data Analysis',
  },
  {
    id: 'req3',
    jobTitle: 'UX Designer - Mobile',
    status: 'On Hold',
    hiringManager: 'Charlie Brown',
    location: 'San Francisco, CA',
    dateCreated: new Date(2023, 11, 1).toISOString(),
    candidateCount: 15,
    averageCrs: 72,
    jobDescription: 'Design intuitive and engaging mobile experiences for iOS and Android. Conduct user research and create prototypes.',
    mustHaveSkills: 'UX Design, Figma, Prototyping, User Research, Mobile Design Patterns',
    niceToHaveSkills: 'UI Design, Interaction Design, Adobe Creative Suite, Usability Testing',
  },
  {
    id: 'req4',
    jobTitle: 'Marketing Specialist',
    status: 'Closed',
    hiringManager: 'Diana Prince',
    location: 'Chicago, IL',
    dateCreated: new Date(2023, 8, 5).toISOString(),
    candidateCount: 50,
    averageCrs: 68,
    jobDescription: 'Develop and execute marketing campaigns across various channels. Analyze campaign performance and optimize for results.',
    mustHaveSkills: 'Digital Marketing, SEO, SEM, Content Creation, Email Marketing',
    niceToHaveSkills: 'Google Analytics, HubSpot, Social Media Advertising, Graphic Design',
  },
];

const RequisitionStatusColors: Record<RequisitionStatus, string> = {
  Draft: 'bg-secondary-500 text-white',
  Open: 'bg-green-500 text-white',
  'On Hold': 'bg-yellow-500 text-black',
  Closed: 'bg-red-500 text-white',
  Filled: 'bg-blue-500 text-white',
};

const RequisitionsPage: React.FC = () => {
  const [requisitions, setRequisitions] = useState<Requisition[]>(initialRequisitions);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);
  const [newRequisitionData, setNewRequisitionData] = useState<Partial<Requisition>>({
    jobTitle: '',
    status: 'Draft',
    jobDescription: '',
    mustHaveSkills: '',
    niceToHaveSkills: '',
    hiringManager: '',
    location: '',
  });

  const handleCreateNew = () => {
    setNewRequisitionData({ jobTitle: '', status: 'Draft', jobDescription: '', mustHaveSkills: '', niceToHaveSkills: '', hiringManager: '', location: '' });
    setShowCreateModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRequisitionData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTextAreaChange = (id: string, value: string) => {
     setNewRequisitionData(prev => ({ ...prev, [id]: value }));
  }


  const handleSaveNewRequisition = () => {
    if (!newRequisitionData.jobTitle || !newRequisitionData.jobDescription) {
      alert('Job Title and Job Description are required.'); // Simple validation
      return;
    }
    const newReq: Requisition = {
      id: `req${Date.now()}`,
      jobTitle: newRequisitionData.jobTitle!,
      status: newRequisitionData.status || 'Draft',
      jobDescription: newRequisitionData.jobDescription!,
      mustHaveSkills: newRequisitionData.mustHaveSkills,
      niceToHaveSkills: newRequisitionData.niceToHaveSkills,
      hiringManager: newRequisitionData.hiringManager,
      location: newRequisitionData.location,
      dateCreated: new Date().toISOString(),
      candidateCount: 0, // New requisitions start with 0 candidates
    };
    setRequisitions(prev => [newReq, ...prev]);
    setShowCreateModal(false);
  };

  const handleViewDetails = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
    setShowViewModal(true);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-800 tracking-tight">Requisitions Management</h1>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-150 ease-in-out flex items-center"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create New Requisition
        </button>
      </header>

      {/* Placeholder Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-secondary-700 flex items-center mb-2">
          <FilterIcon className="h-5 w-5 mr-2 text-primary-500" />
          Filters
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Search by Job Title..." className="p-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
          <select className="p-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="On Hold">On Hold</option>
            <option value="Closed">Closed</option>
          </select>
          {/* Add more filters as needed */}
        </div>
      </div>

      {/* Requisitions Table/List */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center">
                Job Title <ChevronUpDownIcon className="h-4 w-4 ml-1 text-secondary-400" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Candidates</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Avg. CRS</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Created</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {requisitions.map((req) => (
              <tr key={req.id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary-700">{req.jobTitle}</div>
                  <div className="text-xs text-secondary-500">{req.location || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${RequisitionStatusColors[req.status] || 'bg-secondary-200 text-secondary-800'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{req.candidateCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{req.averageCrs ? `${req.averageCrs}%` : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{formatDate(req.dateCreated)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleViewDetails(req)} className="text-primary-600 hover:text-primary-800 transition-colors p-1" title="View Details">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="text-secondary-500 hover:text-secondary-700 transition-colors p-1" title="Edit Requisition (Placeholder)">
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create New Requisition Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-primary-700 mb-6">Create New Requisition</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-secondary-700 mb-1">Job Title *</label>
                <input type="text" name="jobTitle" id="jobTitle" value={newRequisitionData.jobTitle} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <select name="status" id="status" value={newRequisitionData.status} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  {(['Draft', 'Open', 'On Hold', 'Closed'] as RequisitionStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="hiringManager" className="block text-sm font-medium text-secondary-700 mb-1">Hiring Manager</label>
                <input type="text" name="hiringManager" id="hiringManager" value={newRequisitionData.hiringManager} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-1">Location</label>
                <input type="text" name="location" id="location" value={newRequisitionData.location} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <TextAreaInput
                id="jobDescription"
                label="Job Description *"
                value={newRequisitionData.jobDescription || ''}
                onChange={(val) => handleTextAreaChange('jobDescription', val)}
                placeholder="Enter the full job description..."
                rows={8}
              />
              <TextAreaInput
                id="mustHaveSkills"
                label="Must-Have Skills (comma-separated)"
                value={newRequisitionData.mustHaveSkills || ''}
                onChange={(val) => handleTextAreaChange('mustHaveSkills', val)}
                placeholder="e.g., React, Node.js, Python"
                rows={3}
              />
              <TextAreaInput
                id="niceToHaveSkills"
                label="Nice-to-Have Skills (comma-separated)"
                value={newRequisitionData.niceToHaveSkills || ''}
                onChange={(val) => handleTextAreaChange('niceToHaveSkills', val)}
                placeholder="e.g., AWS, Docker, Kubernetes"
                rows={3}
              />
            </div>
            <div className="mt-8 flex justify-end space-x-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-md transition-colors">Cancel</button>
              <button onClick={handleSaveNewRequisition} className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md shadow-sm transition-colors">Save Requisition</button>
            </div>
          </div>
        </div>
      )}

      {/* View Requisition Details Modal */}
      {showViewModal && selectedRequisition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-primary-700 mb-1">{selectedRequisition.jobTitle}</h2>
            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mb-4 ${RequisitionStatusColors[selectedRequisition.status] || 'bg-secondary-200 text-secondary-800'}`}>
                {selectedRequisition.status}
            </span>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Hiring Manager:</strong> {selectedRequisition.hiringManager || 'N/A'}</div>
                <div><strong>Location:</strong> {selectedRequisition.location || 'N/A'}</div>
                <div><strong>Date Created:</strong> {formatDate(selectedRequisition.dateCreated)}</div>
                <div><strong>Candidates:</strong> {selectedRequisition.candidateCount}</div>
                <div><strong>Average CRS:</strong> {selectedRequisition.averageCrs ? `${selectedRequisition.averageCrs}%` : 'N/A'}</div>
              </div>
              
              <div>
                <h4 className="font-semibold text-secondary-700 mt-3 mb-1">Job Description:</h4>
                <p className="text-sm text-secondary-600 bg-secondary-50 p-3 rounded-md whitespace-pre-wrap">{selectedRequisition.jobDescription}</p>
              </div>
              {selectedRequisition.mustHaveSkills && (
                <div>
                  <h4 className="font-semibold text-secondary-700 mt-3 mb-1">Must-Have Skills:</h4>
                  <p className="text-sm text-secondary-600 bg-secondary-50 p-3 rounded-md">{selectedRequisition.mustHaveSkills}</p>
                </div>
              )}
              {selectedRequisition.niceToHaveSkills && (
                <div>
                  <h4 className="font-semibold text-secondary-700 mt-3 mb-1">Nice-to-Have Skills:</h4>
                  <p className="text-sm text-secondary-600 bg-secondary-50 p-3 rounded-md">{selectedRequisition.niceToHaveSkills}</p>
                </div>
              )}
            </div>
            <div className="mt-8 text-right">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-md transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RequisitionsPage;
