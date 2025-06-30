import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">JobBoard</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              The premier destination for connecting talented professionals with exciting career opportunities. 
              Find your dream job or discover your next great hire.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>hello@jobboard.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-300 hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/candidate/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  My Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Employer Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job" className="text-gray-300 hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white transition-colors">
                  Employer Account
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Manage Jobs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 JobBoard. All rights reserved. Built with React, Supabase, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}