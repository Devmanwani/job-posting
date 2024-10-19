import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import JobList from '../components/JobList'

const DashboardPage = () => {
  return (
    <Layout>

      <div className="w-full h-full flex flex-col items-center justify-center">
        <Link to='/create-interview'>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Interview
          </button></Link>

        <JobList />

        {/* Add more dashboard content here */}
      </div>
    </Layout>
  )
}

export default DashboardPage
