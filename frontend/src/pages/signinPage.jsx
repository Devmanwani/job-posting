import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';

export default function SignInPage() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${url}/auth/login`, formData);
      console.log(response.data);


      localStorage.setItem('token', `${response.data.token}`);
      navigate('/'); // Redirect to the home page or dashboard
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.'); // Handle network errors
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-4xl flex gap-8">
            <div className="flex-1 pr-8">
              <p className="text-gray-600 max-w-md">
                Welcome back to Cuvette. Sign in to access your account and continue your journey with us.
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-semibold mb-1 text-center">Sign In</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <p className="text-gray-500 text-center mb-6">Enter your credentials to access your account</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email"
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
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Sign In
                  </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthLayout>
  );
}
