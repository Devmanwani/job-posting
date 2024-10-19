import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';

export default function SignUpPage() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    company: '',
    email: '',
    size: '',
    password: '' // Add password field
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apicall(formData);
      console.log(response.status);
      if (response.status === 201) {
        navigate(`/verify?email=${formData.email}`);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.log(error);
      setError('An error occurred. Please try again.');
    }
  };

  const apicall = async (data) => {
    const response = await axios.post(`${url}/auth/register`, data);
    return response;
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-4xl flex gap-8">
            <div className="flex-1 pr-8">
              <p className="text-gray-600 max-w-md">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-semibold mb-1 text-center">Sign Up</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="sr-only">Phone no.</label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Phone no."
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="sr-only">Company Name</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="sr-only">Company Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Company Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="size" className="sr-only">Employee Size</label>
                    <input
                      id="size"
                      name="size"
                      type="text"
                      required
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Employee Size"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Password"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    By clicking on proceed you will accept our{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link>
                    {' & '}
                    <Link to="/conditions" className="text-blue-600 hover:underline">Conditions</Link>
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Proceed
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthLayout>
  );
}
