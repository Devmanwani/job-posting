import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const JobList = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${url}/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        setMessage('Failed to fetch jobs. Please try again.');
        console.error(error);
      }
    };
    fetchJobs();
  }, []);

  const sendJobAlert = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${url}/emails/send-job-alert/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to send job alerts. Please try again.');
      console.error(error);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/create-interview/${jobId}`);
  };

  return (

    <div className="w-1/2 max-w-2xl mx-auto mt-4">
      {message && <p className="text-center text-red-500 mb-4">{message}</p>}
      <div className="grid grid-cols-1 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="border rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => handleJobClick(job._id)} // Handle job card click
          >
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="mt-1">{job.description}</p>
            <p className="mt-1 text-gray-600">Experience Level: {job.experienceLevel}</p>
            <p className="mt-1 text-gray-600">End Date: {job.endDate}</p>
            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the job click
                  sendJobAlert(job._id);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Send Job Alert
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default JobList;
