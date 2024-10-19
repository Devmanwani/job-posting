import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CreateInterviewPage = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams(); // Assuming the job ID is passed as a URL parameter
  const navigate = useNavigate(); // For navigation
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    experienceLevel: '',
    candidates: [],
    endDate: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchJobData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${url}/jobs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { title, description, experienceLevel, candidates, endDate } = response.data;
          setFormData({
            title,
            description,
            experienceLevel,
            candidates,
            endDate,
          });
        } catch (error) {
          setMessage('Failed to fetch job data. Please try again.');
          console.error(error);
        }
      };
      fetchJobData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addCandidate = (email) => {
    if (email && !formData.candidates.includes(email)) {
      setFormData({
        ...formData,
        candidates: [...formData.candidates, email],
      });
    }
  };

  const removeCandidate = (email) => {
    const updatedCandidates = formData.candidates.filter(candidate => candidate !== email);
    setFormData({ ...formData, candidates: updatedCandidates });
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token')
    e.preventDefault();
    try {
      const response = id
        ? await axios.put(`${url}/jobs/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          }
        })
        : await axios.post(`${url}/jobs`, formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });// Create new job

      if (response.status === 201 || response.status === 200) {
        setMessage('Interview saved successfully!');
        // Optionally, reset the form
        setFormData({
          title: '',
          description: '',
          experienceLevel: '',
          candidates: [],
          endDate: '',
        });
      }
    } catch (error) {
      setMessage('Failed to save interview. Please try again.');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${url}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Interview deleted successfully!');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      setMessage('Failed to delete interview. Please try again.');
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="job-title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              id="job-title"
              name="title"
              placeholder="Enter Job Title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              id="job-description"
              name="description"
              rows={4}
              placeholder="Enter Job Description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="experience-level" className="block text-sm font-medium text-gray-700">Experience Level</label>
            <select
              id="experience-level"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Experience Level</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Add Candidates</label>
            <input
              type="email"
              placeholder="Enter candidate's email"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCandidate(e.target.value);
                  e.target.value = ''; // Clear input after adding
                }
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.candidates.map((candidate, index) => (
                <div key={index} className="flex items-center bg-blue-200 rounded-full px-3 py-1">
                  <span className="text-sm text-blue-800">{candidate}</span>
                  <button
                    type="button"
                    onClick={() => removeCandidate(candidate)}
                    className="ml-2 text-red-500 focus:outline-none"
                  >
                    &times; {/* Cross icon to remove candidate */}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="end-date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Post
          </button>
          {id && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Delete Interview
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default CreateInterviewPage;
