
import React, { useState, useCallback } from 'react';
import type { Candidate, CandidateCrsEntry, CandidateApplication, ActivityLogEntry } from './types';
import { FileUpload } from './components/FileUpload';
import { TextAreaInput } from './components/TextAreaInput';
import { UserPlusIcon } from './components/icons/UserPlusIcon';
import { EyeIcon } from './components/icons/EyeIcon';
import { PencilSquareIcon } from './components/icons/PencilSquareIcon'; // For future edit
import { FilterIcon } from './components/icons/FilterIcon';
import { ChevronUpDownIcon } from './components/icons/ChevronUpDownIcon';
import { TagIcon } from './components/icons/TagIcon';
import { AtSymbolIcon } from './components/icons/AtSymbolIcon';
import { PhoneIcon } from './components/icons/PhoneIcon';
import { MapPinIcon } from './components/icons/MapPinIcon';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';
import { ClockIcon } from './components/icons/ClockIcon';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon'; // For applications

// Sample Data
const initialCandidates: Candidate[] = [
  {
    id: 'cand1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    phone: '555-0101',
    location: 'New York, NY',
    resumeText: 'Experienced software engineer with skills in React, Node.js...',
    tags: ['frontend', 'react', 'senior'],
    source: 'LinkedIn',
    dateAdded: new Date(2023, 10, 1).toISOString(),
    lastActivityDate: new Date(2023, 11, 5).toISOString(),
    crsHistory: [
      { requisitionId: 'req1', requisitionTitle: 'Senior Frontend Engineer', score: 85, date: new Date(2023, 11, 2).toISOString() },
    ],
    applications: [
      { requisitionId: 'req1', requisitionTitle: 'Senior Frontend Engineer', status: 'Interviewing', dateApplied: new Date(2023, 11, 1).toISOString() }
    ],
    activityLog: [
      { date: new Date(2023, 11, 5).toISOString(), activity: 'Moved to Interviewing for Senior Frontend Engineer', user: 'Jane Recruiter' },
      { date: new Date(2023, 11, 2).toISOString(), activity: 'CRS Score 85 generated for Senior Frontend Engineer' },
    ],
    notes: 'Strong candidate, great communication skills in initial screen.'
  },
  {
    id: 'cand2',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    location: 'San Francisco, CA',
    resumeText: 'Product manager with a background in SaaS...',
    tags: ['product', 'saas', 'agile'],
    source: 'Referral',
    dateAdded: new Date(2023, 9, 15).toISOString(),
    lastActivityDate: new Date(2023, 10, 20).toISOString(),
  },
];

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  const [newCandidateData, setNewCandidateData] = useState<Partial<Omit<Candidate, 'id' | 'dateAdded'>>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    resumeText: '',
    tags: [],
    source: '',
  });

  const handleAddNewCandidate = () => {
    setNewCandidateData({ firstName: '', lastName: '', email: '', resumeText: '', tags: [] });
    setShowAddModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCandidateData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeTextChange = (value: string) => {
    setNewCandidateData(prev => ({ ...prev, resumeText: value }));
  };
  
  const handleResumeFileUpload = (content: string) => {
    setNewCandidateData(prev => ({ ...prev, resumeText: content }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewCandidateData(prev => ({ ...prev, tags: tagsArray }));
  };

  const handleSaveNewCandidate = () => {
    if (!newCandidateData.firstName || !newCandidateData.lastName || !newCandidateData.email) {
      alert('First Name, Last Name, and Email are required.');
      return;
    }
    const newCand: Candidate = {
      id: `cand${Date.now()}`,
      firstName: newCandidateData.firstName!,
      lastName: newCandidateData.lastName!,
      email: newCandidateData.email!,
      phone: newCandidateData.phone,
      location: newCandidateData.location,
      resumeText: newCandidateData.resumeText,
      tags: newCandidateData.tags,
      source: newCandidateData.source,
      dateAdded: new Date().toISOString(),
      lastActivityDate: new Date().toISOString(),
      crsHistory: [],
      applications: [],
      activityLog: [{ date: new Date().toISOString(), activity: 'Candidate added manually' }],
    };
    setCandidates(prev => [newCand, ...prev]);
    setShowAddModal(false);
  };

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-800 tracking-tight">Candidate Database</h1>
        <button
          onClick={handleAddNewCandidate}
          className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-150 ease-in-out flex items-center"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add New Candidate
        </button>
      </header>

      {/* Placeholder Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-secondary-700 flex items-center mb-2">
          <FilterIcon className="h-5 w-5 mr-2 text-primary-500" />
          Filters & Search
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Search by Name, Email, Skill..." className="p-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
          <input type="text" placeholder="Filter by Tags (comma-sep)..." className="p-2 border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
          {/* Add more filters as needed */}
        </div>
      </div>

      {/* Candidates Table/List */}
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider flex items-center">
                Name <ChevronUpDownIcon className="h-4 w-4 ml-1 text-secondary-400" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Tags</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Last Activity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {candidates.map((cand) => (
              <tr key={cand.id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary-700">{cand.firstName} {cand.lastName}</div>
                  <div className="text-xs text-secondary-500">{cand.location || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                  <div>{cand.email}</div>
                  <div>{cand.phone || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cand.tags && cand.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {cand.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">{tag}</span>
                      ))}
                      {cand.tags.length > 3 && <span className="text-xs text-secondary-500">+{cand.tags.length-3} more</span>}
                    </div>
                  ) : <span className="text-xs text-secondary-400">No tags</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{formatDate(cand.lastActivityDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleViewProfile(cand)} className="text-primary-600 hover:text-primary-800 transition-colors p-1" title="View Profile">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {/* Placeholder for Edit action */}
                  <button className="text-secondary-500 hover:text-secondary-700 transition-colors p-1" title="Edit Candidate (Placeholder)">
                     <PencilSquareIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
             {candidates.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-secondary-500">
                        No candidates found. Start by adding a new candidate.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-primary-700 mb-6">Add New Candidate</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">First Name *</label>
                  <input type="text" name="firstName" id="firstName" value={newCandidateData.firstName} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-1">Last Name *</label>
                  <input type="text" name="lastName" id="lastName" value={newCandidateData.lastName} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">Email *</label>
                <input type="email" name="email" id="email" value={newCandidateData.email} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">Phone</label>
                  <input type="tel" name="phone" id="phone" value={newCandidateData.phone} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-1">Location</label>
                  <input type="text" name="location" id="location" value={newCandidateData.location} onChange={handleInputChange} className="w-full p-2 border border-secondary-300 rounded-md" />
                </div>
              </div>
               <div>
                  <label htmlFor="source" className="block text-sm font-medium text-secondary-700 mb-1">Source</label>
                  <input type="text" name="source" id="source" value={newCandidateData.source} onChange={handleInputChange} placeholder="e.g., LinkedIn, Referral, Event" className="w-full p-2 border border-secondary-300 rounded-md" />
                </div>
              <FileUpload 
                onFileRead={handleResumeFileUpload} 
                label="Upload Resume (optional, .txt)" 
                buttonText="Upload .txt" 
                compact={true} 
              />
              <TextAreaInput
                id="resumeText"
                label="Or Paste Resume Text (optional)"
                value={newCandidateData.resumeText || ''}
                onChange={handleResumeTextChange}
                rows={6}
                placeholder="Paste resume content here..."
              />
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-1">Tags (comma-separated)</label>
                <input type="text" name="tags" id="tags" value={newCandidateData.tags?.join(', ') || ''} onChange={handleTagsChange} placeholder="e.g., frontend, java, project manager" className="w-full p-2 border border-secondary-300 rounded-md" />
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-md">Cancel</button>
              <button onClick={handleSaveNewCandidate} className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md shadow-sm">Save Candidate</button>
            </div>
          </div>
        </div>
      )}

      {/* View Candidate Profile Modal */}
      {showViewModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-primary-800">{selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
                    <p className="text-secondary-500 text-sm">Candidate Profile</p>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-secondary-500 hover:text-secondary-700 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Contact & Basic Info */}
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-lg font-semibold text-primary-700 border-b pb-2 mb-2">Contact Information</h3>
                    <p className="flex items-center text-sm text-secondary-700"><AtSymbolIcon className="h-4 w-4 mr-2 text-primary-500" /> {selectedCandidate.email}</p>
                    <p className="flex items-center text-sm text-secondary-700"><PhoneIcon className="h-4 w-4 mr-2 text-primary-500" /> {selectedCandidate.phone || 'N/A'}</p>
                    <p className="flex items-center text-sm text-secondary-700"><MapPinIcon className="h-4 w-4 mr-2 text-primary-500" /> {selectedCandidate.location || 'N/A'}</p>
                    
                    <h3 className="text-lg font-semibold text-primary-700 border-b pb-2 mb-2 mt-4">Details</h3>
                    <p className="text-sm"><strong>Source:</strong> {selectedCandidate.source || 'N/A'}</p>
                    <p className="text-sm"><strong>Date Added:</strong> {formatDate(selectedCandidate.dateAdded)}</p>
                    <p className="text-sm"><strong>Last Activity:</strong> {formatDate(selectedCandidate.lastActivityDate)}</p>

                    {selectedCandidate.tags && selectedCandidate.tags.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-secondary-700 mt-3 mb-1 flex items-center"><TagIcon className="h-4 w-4 mr-1 text-primary-500" />Tags:</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedCandidate.tags.map(tag => <span key={tag} className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">{tag}</span>)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Resume, History, Logs */}
                <div className="md:col-span-2 space-y-6">
                    {selectedCandidate.resumeText && (
                        <div>
                            <h3 className="text-lg font-semibold text-primary-700 flex items-center border-b pb-2 mb-2"><DocumentTextIcon className="h-5 w-5 mr-2"/>Resume</h3>
                            <pre className="text-xs text-secondary-600 bg-secondary-50 p-3 rounded-md whitespace-pre-wrap h-48 overflow-y-auto">{selectedCandidate.resumeText}</pre>
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-primary-700 flex items-center border-b pb-2 mb-2"><BriefcaseIcon className="h-5 w-5 mr-2"/>Application History</h3>
                         {selectedCandidate.applications && selectedCandidate.applications.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                                {selectedCandidate.applications.map((app, i) => <li key={i} className="p-2 bg-secondary-50 rounded"><strong>{app.requisitionTitle}:</strong> {app.status} (Applied: {formatDate(app.dateApplied)})</li>)}
                            </ul>
                        ) : <p className="text-sm text-secondary-500">No applications found.</p>}
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-primary-700 flex items-center border-b pb-2 mb-2">CRS History</h3>
                        {selectedCandidate.crsHistory && selectedCandidate.crsHistory.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                                {selectedCandidate.crsHistory.map((crs, i) => <li key={i} className="p-2 bg-secondary-50 rounded"><strong>{crs.requisitionTitle}:</strong> {crs.score}% (On: {formatDate(crs.date)})</li>)}
                            </ul>
                        ) : <p className="text-sm text-secondary-500">No CRS history found.</p>}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-primary-700 flex items-center border-b pb-2 mb-2"><ClockIcon className="h-5 w-5 mr-2"/>Activity Log</h3>
                        {selectedCandidate.activityLog && selectedCandidate.activityLog.length > 0 ? (
                            <ul className="space-y-2 text-sm max-h-40 overflow-y-auto">
                                {selectedCandidate.activityLog.map((log, i) => <li key={i} className="p-2 bg-secondary-50 rounded"><strong>{formatDate(log.date)}:</strong> {log.activity} {log.user && `(by ${log.user})`}</li>)}
                            </ul>
                        ) : <p className="text-sm text-secondary-500">No activity logged.</p>}
                    </div>
                    {selectedCandidate.notes && (
                         <div>
                            <h3 className="text-lg font-semibold text-primary-700 flex items-center border-b pb-2 mb-2">Internal Notes</h3>
                            <pre className="text-sm text-secondary-600 bg-secondary-50 p-3 rounded-md whitespace-pre-wrap">{selectedCandidate.notes}</pre>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 text-right">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesPage;
