// src/app/jobs/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { container } from '@/shared/container';
import { Job } from '@/entities/job';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await container.getJobsUseCase.execute();
      setJobs(jobsData);
    } catch (error) {
      setMessage('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const jobsData = await container.searchJobsUseCase.execute({ query: searchQuery });
      setJobs(jobsData);
    } catch (error) {
      setMessage('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to apply to this job?')) {
      return;
    }

    try {
      setApplying(true);
      await container.applyToJobUseCase.execute(jobId);
      
      // Update the job status in the UI
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, applied: true } : job
        )
      );
      
      setMessage('Successfully applied to the job!');
    } catch (error) {
      setMessage('Failed to apply to the job. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-2xl font-semibold">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through thousands of job opportunities tailored to your skills and interests.
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs by title, company, or keyword..."
            className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`max-w-2xl mx-auto mb-6 p-3 rounded-md text-center ${
          message.includes('Successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600 mt-1">{job.company}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {job.type || 'Full-time'}
                </span>
              </div>
              
              <p className="mt-4 text-gray-700 line-clamp-2">{job.description}</p>
              
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </div>
              
              {job.salary && (
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">Salary:</span> {job.salary}
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={job.applied || applying}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    job.applied 
                      ? 'bg-gray-200 text-gray-700 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {job.applied ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-lg text-gray-600 mt-1">{selectedJob.company}</p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <p className="mt-2 text-gray-700">{selectedJob.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-700">
                    {selectedJob.requirements?.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    )) || <li>No requirements listed</li>}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Location</h3>
                    <p className="mt-1 text-gray-700">{selectedJob.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Type</h3>
                    <p className="mt-1 text-gray-700">{selectedJob.type || 'Not specified'}</p>
                  </div>
                  {selectedJob.salary && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Salary</h3>
                      <p className="mt-1 text-gray-700">{selectedJob.salary}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Experience</h3>
                    <p className="mt-1 text-gray-700">{selectedJob.experience || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  disabled={selectedJob.applied || applying}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedJob.applied 
                      ? 'bg-gray-200 text-gray-700 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {selectedJob.applied ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}