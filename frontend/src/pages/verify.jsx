import React, { useState, useEffect } from 'react';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Verify = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [resendAvailable, setResendAvailable] = useState(false);
  const [timer, setTimer] = useState(0);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  useEffect(() => {
    const storedTimer = localStorage.getItem('resendTimer');
    if (storedTimer) {
      const remainingTime = parseInt(storedTimer, 10);
      if (remainingTime > 0) {
        setTimer(remainingTime);
        setResendAvailable(false);
      } else {
        setResendAvailable(true);
      }
    } else {
      setResendAvailable(true);
    }
  }, []);

  useEffect(() => {
    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('resendTimer', newTime);
          if (newTime <= 0) {
            setResendAvailable(true);
            localStorage.removeItem('resendTimer');
            clearInterval(interval);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailVerify = async () => {
    try {
      const response = await axios.post(`${url}/auth/verify`, { otp: emailOtp, email });
      if (response.status === 200) {
        setEmailVerified(true);
        setVerificationMessage('Email verified successfully!');
        navigate('/dashboard');
      } else {
        setVerificationMessage('Verification failed. Please try again.');
      }
    } catch (error) {
      console.log(error);
      setVerificationMessage('An error occurred. Please try again.');
    }
  };

  const handleResendEmail = async () => {
    if (resendAvailable) {
      try {
        await axios.post(`${url}/auth/resend-otp`, { email });
        setVerificationMessage('Verification email resent! Check your inbox.');
        setResendAvailable(false);
        setTimer(300); // Set timer for 5 minutes
        localStorage.setItem('resendTimer', 300);
      } catch (error) {
        console.log(error);
        setVerificationMessage('Failed to resend verification email. Please try again.');
      }
    } else {
      setVerificationMessage('You can resend the email in ' + Math.ceil(timer / 60) + ' minutes.');
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-4xl flex gap-8">
        <div className="flex-1 pr-8">
          <p className="text-gray-600 max-w-md">
            Please verify your email to continue.
          </p>
        </div>
        <div className="flex-1">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-semibold mb-1 text-center">Email Verification</h2>
            {verificationMessage && <p className="text-gray-500 text-center mb-4">{verificationMessage}</p>}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <label htmlFor="email-otp" className="sr-only">Email OTP</label>
                <input
                  id="email-otp"
                  type="text"
                  placeholder="Email OTP"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {emailVerified && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <button
                type="button"
                onClick={handleEmailVerify}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={handleResendEmail}
                className={`w-full ${resendAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                disabled={!resendAvailable}
              >
                Resend Email
              </button>
              {!resendAvailable && (
                <p className="text-center text-gray-500">
                  Resend available in {Math.ceil(timer / 60)} minute{Math.ceil(timer / 60) > 1 ? 's' : ''}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Verify;
