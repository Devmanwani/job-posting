import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img
            src="cuvette_logo.png"
            alt="Cuvette Logo"
            width={120}
            height={30}
          />
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
